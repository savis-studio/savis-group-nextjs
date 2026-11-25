import * as migration_20261123_102548_initial from './20261123_102548_initial';
import * as migration_20261125_041332_inquiries from './20261125_041332_inquiries';
import * as migration_20261125_043957_insights from './20261125_043957_insights';
import * as migration_20261125_080132_inquiry_hubspot from './20261125_080132_inquiry_hubspot';
import * as migration_20261125_081626_inquiry_services from './20261125_081626_inquiry_services';

export const migrations = [
  {
    up: migration_20261123_102548_initial.up,
    down: migration_20261123_102548_initial.down,
    name: '20261123_102548_initial',
  },
  {
    up: migration_20261125_041332_inquiries.up,
    down: migration_20261125_041332_inquiries.down,
    name: '20261125_041332_inquiries',
  },
  {
    up: migration_20261125_043957_insights.up,
    down: migration_20261125_043957_insights.down,
    name: '20261125_043957_insights',
  },
  {
    up: migration_20261125_080132_inquiry_hubspot.up,
    down: migration_20261125_080132_inquiry_hubspot.down,
    name: '20261125_080132_inquiry_hubspot',
  },
  {
    up: migration_20261125_081626_inquiry_services.up,
    down: migration_20261125_081626_inquiry_services.down,
    name: '20261125_081626_inquiry_services'
  },
];
