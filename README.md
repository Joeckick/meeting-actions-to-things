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

## Quick Setup (recommended)

The easiest way to get started - no coding required.

### Prerequisites

- Google account
- Things 3 with Things Cloud enabled
- Claude API key from [console.anthropic.com](https://console.anthropic.com)

### 1. Copy the script

**[Click here to copy the script to your Google account](https://script.google.com/d/1E4S5AIIWpE8FwCXMghUNPavj35HN1lBfZjFEDjLzsnaltMZ_LbxURSbZ/edit?usp=sharing)**

Then click **File → Make a copy**

### 2. Configure your settings

In your copied script:

1. Click **Project Settings** (gear icon on the left)
2. Scroll to **Script Properties**
3. Click **Add Script Property** for each:

| Property | Description | Example |
|----------|-------------|---------|
| `THINGS_EMAIL` | Your Things Mail Drop address | `add-to-things-xxxxx@things.email` |
| `YOUR_NAME` | Your name as it appears in transcripts | `Jane Smith` |
| `CLAUDE_API_KEY` | Your Anthropic API key | `sk-ant-xxxxx` |

> **Finding your Things Mail Drop address:** In Things 3, go to **Settings → Things Cloud → Mail to Things**

### 3. Test it

1. Select `viewConfig` from the function dropdown → click **Run**
2. Select `testThingsMailDrop` → **Run** → check your Things inbox
3. Select `testExtraction` → **Run** → check the logs

### 4. Enable automatic processing

Select `setupTrigger` → **Run**

Done! The script will now check for new transcripts every 15 minutes.

---

## Developer Setup

For developers who want to customize or contribute.

### Prerequisites

- Node.js installed
- Google account
- Things 3 with Things Cloud enabled
- Claude API key from [console.anthropic.com](https://console.anthropic.com)

### 1. Clone and setup

```bash
# Install clasp (Google Apps Script CLI)
npm install -g @google/clasp

# Login to Google
clasp login

# Enable Apps Script API at:
# https://script.google.com/home/usersettings

# Clone the repo
git clone https://github.com/Joeckick/meeting-actions-to-things.git
cd meeting-actions-to-things

# Create your Apps Script project
clasp create --title "Meeting Actions to Things" --rootDir ./src

# Push the code
clasp push

# Open in browser
clasp open
```

### 2. Configure Script Properties

In the Apps Script editor:

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

### 3. Test and enable

```bash
# Test in Apps Script editor:
# 1. viewConfig() - verify settings
# 2. testThingsMailDrop() - test Things integration
# 3. testExtraction() - test Claude extraction
# 4. setupTrigger() - enable automation
```

### Development workflow

```bash
# Push local changes
clasp push

# Pull remote changes
clasp pull
```

---

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
├── LICENSE
└── README.md
```

## Functions reference

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

## How action extraction works

The script uses Claude to identify action items assigned to you. For example:

**Transcript:**
> → Joe Smith will consider how to address the challenge
> → Joe Smith and Jane Doe will talk to the team about the proposal

**Extracted actions for Joe Smith:**
- "Consider how to address the challenge"
- "Talk to the team with Jane Doe about the proposal"

Claude removes your name from the start and creates clean, actionable task titles.

## Costs

- **Google Apps Script**: Free
- **Claude API**: ~$0.002-0.01 per transcript (~$1-2/month typical usage)
- **Things 3**: You already own it

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
