# Meeting Actions to Things 3

Automatically extracts your action items from Google Meet transcripts and sends them to Things 3.

## How it works

```
Google Meet transcript email arrives
    ↓
Apps Script finds new transcript emails in inbox
    ↓
Claude extracts actions assigned to you
    ↓
Each action emailed to Things Mail Drop
    ↓
Tasks appear in your Things Inbox
```

## Project structure

```
├── src/
│   ├── Code.gs          # Main processing logic
│   ├── Config.gs        # Configuration and secrets management
│   ├── Triggers.gs      # Automatic trigger setup
│   ├── Test.gs          # Test functions
│   └── appsscript.json  # Apps Script manifest
├── .clasp.json.example  # Clasp config template
├── .gitignore
└── README.md
```

## Setup

### Prerequisites

- Node.js installed
- A Google account
- Things 3 with Things Cloud enabled (for Mail Drop)
- Claude API key from [console.anthropic.com](https://console.anthropic.com)

### 1. Install clasp

```bash
npm install -g @google/clasp
```

### 2. Login to Google

```bash
clasp login
```

This opens a browser to authenticate with your Google account.

### 3. Enable Apps Script API

Visit https://script.google.com/home/usersettings and enable the **Google Apps Script API**.

### 4. Clone this repo

```bash
git clone https://github.com/Joeckick/meeting-actions-to-things.git
cd meeting-actions-to-things
```

### 5. Create a new Apps Script project

```bash
clasp create --title "Meeting Actions to Things" --rootDir ./src
```

This creates `.clasp.json` with your script ID.

### 6. Push the code

```bash
clasp push
```

### 7. Configure secrets

Open the Apps Script editor:

```bash
clasp open
```

Then:
1. Click **Project Settings** (gear icon)
2. Scroll to **Script Properties**
3. Add each property:

| Property | Description | Example |
|----------|-------------|---------|
| `THINGS_EMAIL` | Your Things Mail Drop address | `add-to-things-xxxxx@things.email` |
| `YOUR_NAME` | Your name as it appears in transcripts | `Jane Smith` |
| `CLAUDE_API_KEY` | Your Anthropic API key | `sk-ant-xxxxx` |

Optional:

| Property | Default | Description |
|----------|---------|-------------|
| `PROCESSED_LABEL` | `Actions-Extracted` | Gmail label for processed emails |
| `GMAIL_SEARCH_QUERY` | `from:gemini-notes@google.com in:inbox -label:Actions-Extracted` | Gmail search filter |

### 8. Test the integration

In the Apps Script editor, run these functions in order:

1. `viewConfig()` - verify your settings are correct
2. `testThingsMailDrop()` - check a test task appears in Things
3. `testExtraction()` - check Claude extracts actions correctly
4. `testWithRealEmail()` - test extraction on a real transcript (doesn't send to Things)
5. `processNewTranscripts()` - process for real

### 9. Enable automatic processing

Run `setupTrigger()` to check for new transcripts every 15 minutes.

## Functions

| Function | Description |
|----------|-------------|
| `processNewTranscripts()` | Main function - processes new transcript emails |
| `viewConfig()` | View current configuration |
| `setSecrets()` | Set Script Properties (edit values in code first) |
| `clearSecrets()` | Clear all Script Properties |
| `testExtraction()` | Test Claude with sample transcript |
| `testWithRealEmail()` | Test extraction on real email (no send) |
| `testThingsMailDrop()` | Test Things Mail Drop integration |
| `setupTrigger()` | Enable 15-minute automatic trigger |
| `removeTrigger()` | Disable automatic trigger |
| `listTriggers()` | List all triggers |

## Development workflow

Make changes locally, then push:

```bash
clasp push
```

Pull remote changes:

```bash
clasp pull
```

## Costs

- **Google Apps Script**: Free
- **Claude API**: ~$0.002-0.01 per transcript (~$1-2/month typical usage)
- **Things 3**: You already own it

## How action extraction works

The script uses Claude to identify action items assigned to you. For example:

**Transcript:**
> → Joe Smith will consider how to address the challenge
> → Joe Smith and Jane Doe will talk to the team about the proposal

**Extracted actions for Joe Smith:**
- "Consider how to address the challenge"
- "Talk to the team with Jane Doe about the proposal"

Claude removes your name from the start and creates clean, actionable task titles.

## Troubleshooting

### "Claude API returned 401"
API key is invalid or expired. Check at console.anthropic.com.

### "No new transcript emails found"
- Check your Gmail search query matches your transcript emails
- Try the query directly in Gmail to verify
- Make sure the email doesn't already have the "Actions-Extracted" label

### Actions not appearing in Things
- Verify your Things Mail Drop address is correct
- Run `testThingsMailDrop()` to send a test task
- Check Things Cloud is enabled in Things settings

### Script doesn't run automatically
- Run `listTriggers()` to check trigger exists
- Check Apps Script execution log for errors
- Verify Gmail permissions were granted

## Security notes

- Secrets are stored in Google's Script Properties, not in code
- API key never appears in version control
- `.clasp.json` is gitignored (contains your script ID)
- Rotate your Claude API key if it's ever exposed

## Limitations

- Things Mail Drop only supports task title and notes (no tags, due dates, or projects via email)
- Transcript must be from Gemini (`gemini-notes@google.com`)
- Your name must match exactly as it appears in the transcript

## License

MIT

## Contributing

Pull requests welcome! Please open an issue first to discuss changes.
