import * as migration_20261123_102548_initial from './20261123_102548_initial';

export const migrations = [
  {
    up: migration_20261123_102548_initial.up,
    down: migration_20261123_102548_initial.down,
    name: '20261123_102548_initial'
  },
];
