import * as migration_20261123_102548_initial from './20261123_102548_initial';
import * as migration_20261125_041332_inquiries from './20261125_041332_inquiries';

export const migrations = [
  {
    up: migration_20261123_102548_initial.up,
    down: migration_20261123_102548_initial.down,
    name: '20261123_102548_initial',
  },
  {
    up: migration_20261125_041332_inquiries.up,
    down: migration_20261125_041332_inquiries.down,
    name: '20261125_041332_inquiries'
  },
];
