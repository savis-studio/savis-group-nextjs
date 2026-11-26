/* Local Docker helper for development and pre-release testing (docker-compose.local.yml).
   On Windows, Docker Engine runs inside WSL (SAVIS_WSL_DISTRO, default Ubuntu-24.04); elsewhere `docker` is used directly.
   Usage: node scripts/local.mjs up | seed | logs | down | reset | restore <dump> | dev | migration <name> | stop */
import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { closeSync, existsSync, openSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const windows = process.platform === "win32";
const distro = process.env.SAVIS_WSL_DISTRO ?? "Ubuntu-24.04";
const ENV_FILE = ".env.staging.local";
const DEV_DATABASE_URL = "postgres://savis:savis-local-dev@127.0.0.1:5433/savis_dev";
const STAGING_URL = "http://localhost:3100";

const wsl = ["-d", distro, "-u", "root"];
const BUILD_DIR = "/var/tmp/savis-src";
// WSLENV hands the variable to docker compose inside the distro.
if (windows) Object.assign(process.env, { SAVIS_BUILD_CONTEXT: BUILD_DIR, WSLENV: [process.env.WSLENV, "SAVIS_BUILD_CONTEXT"].filter(Boolean).join(":") });

function run(command, args, options = {}) {
  const r = spawnSync(command, args, { cwd: root, stdio: "inherit", ...options });
  if (r.error) throw r.error;
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function docker(args, options) {
  if (windows) run("wsl.exe", [...wsl, "--cd", root, "--exec", "docker", ...args], options);
  else run("docker", args, options);
}

const compose = (args, options) => docker(["compose", "-f", "docker-compose.local.yml", "--env-file", ENV_FILE, ...args], options);

/** WSL stops the distro, and the containers with it, once no Windows process is attached. This process holds it open. */
function keepAlive() {
  if (!windows) return;
  const script = "pgrep -f '^savis-keepalive' >/dev/null || exec -a savis-keepalive sleep infinity";
  spawn("wsl.exe", [...wsl, "--exec", "bash", "-c", script], { detached: true, stdio: "ignore", windowsHide: true }).unref();
}

/** Throw-away secrets for the local stack, created once and ignored by git. */
function ensureEnvFile() {
  const file = path.join(root, ENV_FILE);
  if (existsSync(file)) return;
  const secret = () => randomBytes(32).toString("hex");
  writeFileSync(file, `# Local staging only. Never copy production values here.\nPAYLOAD_SECRET=${secret()}\nPOSTGRES_PASSWORD=${secret()}\n`);
  console.log(`Created ${ENV_FILE}`);
}

/** Docker takes many minutes to scan the repository through /mnt/c, so on Windows the build reads a copy inside the
    distro: the files git tracks or would track (so nothing ignored, such as node_modules or .env). */
function copySources() {
  if (!windows) return;
  const list = spawnSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 26 });
  if (list.status !== 0) throw new Error("git ls-files failed");
  const files = list.stdout.split("\0").filter((f) => f && existsSync(path.join(root, f)));
  console.log(`Copying ${files.length} source files into WSL...`);
  const script = `set -o pipefail; rm -rf ${BUILD_DIR} && mkdir -p ${BUILD_DIR} && tar --null -T - -cf - | tar -xf - -C ${BUILD_DIR}`;
  run("wsl.exe", [...wsl, "--cd", root, "--exec", "bash", "-c", script], { input: files.join("\0"), stdio: ["pipe", "inherit", "inherit"] });
}

const startPostgres =() => compose(["up", "-d", "--wait", "postgres"]);

function migrateAndStart() {
  compose(["run", "--rm", "tools", "npx", "payload", "migrate"]);
  compose(["up", "-d", "--wait", "app"]);
  console.log(`\nStaging is ready: ${STAGING_URL}  (admin: ${STAGING_URL}/admin)`);
}

function startDevDatabase() {
  compose(["--profile", "dev", "up", "-d", "--wait", "devdb"]);
}

/** Runs a project CLI on the host against the dev database. */
function onDevDatabase(bin, args) {
  startDevDatabase();
  run(process.execPath, [path.join(root, "node_modules", bin), ...args], { env: { ...process.env, DATABASE_URL: DEV_DATABASE_URL } });
}

const commands = {
  // The release path of deploy.sh: build the images, migrate, start.
  up() {
    copySources();
    compose(["--profile", "tools", "build", "app", "tools"]);
    startPostgres();
    migrateAndStart();
  },
  seed() {
    startPostgres();
    compose(["run", "--rm", "tools", "npm", "run", "seed"]);
    compose(["run", "--rm", "tools", "npm", "run", "import:insights"]);
  },
  logs: () => compose(["logs", "-f", "--tail", "100", "app"]),
  down: () => compose(["rm", "--stop", "--force", "app", "postgres"]),
  reset() {
    commands.down();
    docker(["volume", "rm", "--force", "savis-local_pgdata", "savis-local_media"]);
  },
  /** Replaces the staging database with a pg_dump -Fc file, then migrates: the rehearsal for a schema change. */
  restore(file) {
    if (!file || !existsSync(path.resolve(file))) {
      console.error("Usage: npm run staging:restore -- <file.dump>");
      process.exit(1);
    }
    compose(["rm", "--stop", "--force", "app"]);
    startPostgres();
    const psql = ["exec", "-T", "postgres", "psql", "-U", "savis", "-d", "postgres", "-v", "ON_ERROR_STOP=1"];
    compose([...psql, "-c", "drop database if exists savis with (force)", "-c", "create database savis"]);
    const dump = openSync(path.resolve(file), "r");
    compose(["exec", "-T", "postgres", "pg_restore", "-U", "savis", "-d", "savis", "--no-owner", "--exit-on-error"], { stdio: [dump, "inherit", "inherit"] });
    closeSync(dump);
    migrateAndStart();
  },
  dev: (...args) => onDevDatabase("next/dist/bin/next", ["dev", ...args]),
  migration(name) {
    if (!name) {
      console.error("Usage: npm run db:migration -- <name>");
      process.exit(1);
    }
    onDevDatabase("payload/bin.js", ["migrate:create", name]);
  },
  // Stops every local container (data is kept) and lets WSL shut down.
  stop() {
    compose(["--profile", "dev", "--profile", "tools", "down"]);
    if (windows) spawnSync("wsl.exe", [...wsl, "--exec", "pkill", "-f", "^savis-keepalive"], { stdio: "ignore" });
  },
};

const [name, ...args] = process.argv.slice(2);
if (!Object.hasOwn(commands, name ?? "")) {
  console.error(`Commands: ${Object.keys(commands).join(", ")}`);
  process.exit(1);
}
ensureEnvFile();
if (name !== "stop") keepAlive();
commands[name](...args);
