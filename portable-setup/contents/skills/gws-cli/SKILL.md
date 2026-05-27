---
name: gws-cli
description: Google Workspace CLI (gws) for Slides, Sheets, Docs, and Drive operations. Includes version pinning, auth setup, and Claude Desktop/Code integration. Use when creating or reading Google Slides, Sheets, Docs, managing Drive files, or configuring gws for MCP.
---

# Google Workspace CLI (gws)

Operate on Google Slides, Sheets, Docs, and Drive from the command line using the `gws` CLI. Includes critical setup notes, auth configuration, and integration with Claude Desktop/Code.

## When to Use This Skill

- Creating, reading, or modifying Google Slides presentations
- Reading or writing Google Sheets data
- Creating or appending to Google Docs
- Listing, searching, or sharing Google Drive files
- Setting up gws CLI or MCP integration
- Troubleshooting gws auth or timeout issues

## Critical Setup

### Version Pinning

```bash
# MUST use v0.6.3 -- v0.8.0 removed the `mcp` subcommand
npm install -g @googleworkspace/cli@0.6.3

# Verify
gws --version  # Should output: gws 0.6.3
```

### GCP Project

- Project ID: `543367446979`
- APIs must be individually enabled in GCP Console for each service you use
- Required APIs: Slides API, Sheets API, Docs API, Drive API

### Auth

```bash
# Authenticate (opens browser for OAuth)
gws auth login

# Check auth status
gws auth status

# For GCP project setup:
gcloud auth application-default login --project 543367446979
```

---

## Claude Integration

### Claude Desktop (MCP)

- **5-second timeout** on `tools/list` -- each service adds ~1 second
- Keep to **3 services max** in full mode, or 4 in compact mode
- Current config: gws MCP for Slides, Sheets, Docs (full mode)
- Gmail/Calendar/Drive use Claude Desktop's native connectors instead

**Config location:** `~/Library/Application Support/Claude/claude_desktop_config.json`

### Claude Code (Terminal)

- **No timeout issues** -- run `gws` commands directly via Bash
- All services available without MCP overhead
- Preferred method for heavy operations

---

## Google Slides

```bash
# List presentations (recent)
gws slides presentations list

# Get presentation details
gws slides presentations get --params '{"presentationId": "PRESENTATION_ID"}'

# Create new presentation
gws slides presentations create --params '{"title": "My Presentation"}'

# Get specific slide
gws slides presentations pages get --params '{
  "presentationId": "PRESENTATION_ID",
  "pageObjectId": "PAGE_ID"
}'

# Batch update (add slides, modify content)
gws slides presentations batchUpdate --params '{
  "presentationId": "PRESENTATION_ID",
  "requests": [
    {
      "createSlide": {
        "slideLayoutReference": { "predefinedLayout": "TITLE_AND_BODY" }
      }
    }
  ]
}'
```

---

## Google Sheets

```bash
# List spreadsheets
gws sheets spreadsheets list

# Get spreadsheet info
gws sheets spreadsheets get --params '{"spreadsheetId": "SHEET_ID"}'

# Read cell range
gws sheets spreadsheets values get --params '{
  "spreadsheetId": "SHEET_ID",
  "range": "Sheet1!A1:D10"
}'

# Write to cells
gws sheets spreadsheets values update --params '{
  "spreadsheetId": "SHEET_ID",
  "range": "Sheet1!A1",
  "valueInputOption": "USER_ENTERED",
  "requestBody": {
    "values": [["Name", "Email"], ["Tom", "tom@example.com"]]
  }
}'

# Append rows
gws sheets spreadsheets values append --params '{
  "spreadsheetId": "SHEET_ID",
  "range": "Sheet1!A:D",
  "valueInputOption": "USER_ENTERED",
  "requestBody": {
    "values": [["New Row", "Data", "Here"]]
  }
}'

# Create new spreadsheet
gws sheets spreadsheets create --params '{"properties": {"title": "My Sheet"}}'
```

---

## Google Docs

```bash
# List documents
gws docs documents list

# Get document content
gws docs documents get --params '{"documentId": "DOC_ID"}'

# Create new document
gws docs documents create --params '{"title": "My Document"}'

# Batch update (insert text, format, etc.)
gws docs documents batchUpdate --params '{
  "documentId": "DOC_ID",
  "requests": [
    {
      "insertText": {
        "location": { "index": 1 },
        "text": "Hello, World!\n"
      }
    }
  ]
}'
```

---

## Google Drive

```bash
# List files (recent, ordered by modified time)
gws drive files list --params '{
  "q": "mimeType != \"application/vnd.google-apps.folder\"",
  "orderBy": "modifiedTime desc",
  "pageSize": 10
}'

# Search for specific files
gws drive files list --params '{
  "q": "name contains \"project\" and mimeType = \"application/vnd.google-apps.document\"",
  "orderBy": "modifiedTime desc"
}'

# Get file metadata
gws drive files get --params '{"fileId": "FILE_ID"}'

# Export file (e.g., Google Doc to plain text)
gws drive files export --params '{
  "fileId": "FILE_ID",
  "mimeType": "text/plain"
}'

# Share file
gws drive permissions create --params '{
  "fileId": "FILE_ID",
  "requestBody": {
    "role": "reader",
    "type": "user",
    "emailAddress": "user@example.com"
  }
}'

# List folder contents
gws drive files list --params '{
  "q": "\"FOLDER_ID\" in parents",
  "orderBy": "name"
}'
```

---

## Common MIME Types

| Type | MIME |
|------|------|
| Google Doc | `application/vnd.google-apps.document` |
| Google Sheet | `application/vnd.google-apps.spreadsheet` |
| Google Slides | `application/vnd.google-apps.presentation` |
| Folder | `application/vnd.google-apps.folder` |
| PDF | `application/pdf` |
| Plain text | `text/plain` |

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `gws auth login` | Authenticate |
| `gws slides presentations get --params '{...}'` | Get slide deck |
| `gws sheets spreadsheets values get --params '{...}'` | Read sheet data |
| `gws docs documents get --params '{...}'` | Read document |
| `gws drive files list --params '{...}'` | List/search files |
| `gws drive files export --params '{...}'` | Export file |

## Execution Notes

- All `gws` commands use `--params` with a JSON string for arguments. Quote carefully.
- In Claude Code, run `gws` directly via Bash. No MCP overhead or timeout issues.
- In Claude Desktop, the MCP server has a 5-second `tools/list` timeout. Keep services to 3 max.
- Version MUST be 0.6.3. If commands fail, check with `gws --version`.
- File IDs can be extracted from Google URLs: `docs.google.com/document/d/{FILE_ID}/edit`
- For bulk operations on Sheets, use `batchUpdate` instead of multiple individual calls.
