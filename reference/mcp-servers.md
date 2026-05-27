---
tags: [claude, mcp, infrastructure]
status: active
updated: 2026-03-06
---

# MCP Servers

Model Context Protocol servers connecting Claude Code to external services.

## Local Servers

| Server | Path | Purpose |
|--------|------|---------|
| gmail-mcp | `~/gmail-mcp/` | Gmail read/search/draft via Google OAuth |
| google-calendar-mcp | `~/google-calendar-mcp/` | Google Calendar events, free time, scheduling |
| mcp-google-sheets-railway | `~/mcp-google-sheets-railway/` | Google Sheets read/write (Railway-deployed backend) |

## Configured Servers (in Claude settings)

| Server | Purpose |
|--------|---------|
| context7 | Documentation lookup for any library |
| google-sheets | Google Sheets MCP (direct) |
| media-pipeline | Image/video generation (FAL, Replicate) |
| n8n | n8n workflow automation, trigger/monitor workflows |

## Available Tools

### Gmail MCP
- `gmail_search_messages`: search by query
- `gmail_read_message`: read full message by ID
- `gmail_create_draft`: create draft email
- `gmail_get_profile`: get account info
- `gmail_list_drafts`: list drafts
- `gmail_read_thread`: read full thread

### Google Calendar MCP
- `gcal_list_events` / `gcal_get_event`: view calendar
- `gcal_create_event` / `gcal_update_event` / `gcal_delete_event`: manage events
- `gcal_find_meeting_times` / `gcal_find_my_free_time`: scheduling
- `gcal_respond_to_event`, RSVP
- `gcal_list_calendars`: list calendars

### Google Sheets MCP
- `get_sheet_data` / `get_multiple_sheet_data`: read data
- `update_cells` / `batch_update_cells`: write data
- `create_spreadsheet` / `create_sheet`: create new
- `list_spreadsheets` / `list_sheets`: browse

### Media Pipeline MCP
- `generate_video` / `image_to_video`: video generation
- `create_asset` / `edit_image` / `composite_images`: image creation
- `remove_background` / `describe_image`: image utilities

## Built Servers (Additional)

| Server | Path | Purpose |
|--------|------|---------|
| Supabase MCP | `~/Code_Projects/supabase-mcp-server/` | [[Supabase]] database access |
| Google Docs MCP | (various) | Document integration |

Note: Some servers also live under `~/Code_Projects/` (gmail-mcp, google-calendar-mcp, n8n-mcp-server).

## Related

- [[Claude Code]]
- [[Claude Ecosystem]]
- [[n8n Workflows]]
- [[MCP]]
