import * as migration_20261123_102548_initial from './20261123_102548_initial';
import * as migration_20261125_041332_inquiries from './20261125_041332_inquiries';
import * as migration_20261125_043957_insights from './20261125_043957_insights';
import * as migration_20261125_080132_inquiry_hubspot from './20261125_080132_inquiry_hubspot';
import * as migration_20261125_081626_inquiry_services from './20261125_081626_inquiry_services';
import * as migration_20261126_023131_drafts_mcp from './20261126_023131_drafts_mcp';
import * as migration_20261126_093154_insight_cover_media_card from './20261126_093154_insight_cover_media_card';
import * as migration_20261127_081851_insight_section_no_default from './20261127_081851_insight_section_no_default';
import * as migration_20261127_101523_reports_and_document_requests from './20261127_101523_reports_and_document_requests';

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
    name: '20261125_081626_inquiry_services',
  },
  {
    up: migration_20261126_023131_drafts_mcp.up,
    down: migration_20261126_023131_drafts_mcp.down,
    name: '20261126_023131_drafts_mcp',
  },
  {
    up: migration_20261126_093154_insight_cover_media_card.up,
    down: migration_20261126_093154_insight_cover_media_card.down,
    name: '20261126_093154_insight_cover_media_card',
  },
  {
    up: migration_20261127_081851_insight_section_no_default.up,
    down: migration_20261127_081851_insight_section_no_default.down,
    name: '20261127_081851_insight_section_no_default',
  },
  {
    up: migration_20261127_101523_reports_and_document_requests.up,
    down: migration_20261127_101523_reports_and_document_requests.down,
    name: '20261127_101523_reports_and_document_requests'
  },
];
