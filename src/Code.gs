// =============================================================================
// Meeting Actions to Things 3
// Automatically extracts your action items from Google Meet transcripts
// and sends them to Things 3 via Mail Drop
// =============================================================================

// -----------------------------------------------------------------------------
// MAIN FUNCTION - Run this manually or set up a trigger
// -----------------------------------------------------------------------------

function processNewTranscripts() {
  const config = getConfig();

  if (!config.claudeApiKey) {
    Logger.log('ERROR: Claude API key not set. Run setSecrets() first.');
    return;
  }

  if (!config.thingsEmailAddress) {
    Logger.log('ERROR: Things email not set. Run setSecrets() first.');
    return;
  }

  const threads = GmailApp.search(config.gmailSearchQuery, 0, 10);

  if (threads.length === 0) {
    Logger.log('No new transcript emails found');
    return;
  }

  Logger.log(`Found ${threads.length} transcript email(s) to process`);

  // Get or create the processed label
  let label = GmailApp.getUserLabelByName(config.processedLabel);
  if (!label) {
    label = GmailApp.createLabel(config.processedLabel);
  }

  for (const thread of threads) {
    try {
      processThread(thread, label, config);
    } catch (error) {
      Logger.log(`Error processing thread: ${error.message}`);
    }
  }
}

// -----------------------------------------------------------------------------
// PROCESS A SINGLE EMAIL THREAD
// -----------------------------------------------------------------------------

function processThread(thread, label, config) {
  const messages = thread.getMessages();
  const message = messages[messages.length - 1]; // Get the latest message

  const subject = message.getSubject();
  const body = message.getPlainBody();
  const date = message.getDate();

  Logger.log(`Processing: ${subject}`);

  // Extract actions using Claude
  const actions = extractActionsWithClaude(body, subject, config);

  if (actions.length === 0) {
    Logger.log('No actions found for you in this transcript');
  } else {
    Logger.log(`Found ${actions.length} action(s) for you`);

    // Send each action to Things
    for (const action of actions) {
      sendToThings(action, subject, date, config);
    }
  }

  // Apply label to mark as processed
  thread.addLabel(label);
}

// -----------------------------------------------------------------------------
// EXTRACT ACTIONS USING CLAUDE API
// -----------------------------------------------------------------------------

function extractActionsWithClaude(emailBody, meetingTitle, config) {
  const prompt = `You are extracting action items from a meeting transcript.

Meeting: ${meetingTitle}

Transcript content:
${emailBody}

Extract ONLY the action items assigned to "${config.yourName}".

For each action, return a clean, actionable task title. Remove the person's name from the start.

For example:
- "Joe Wapshott will consider how to address the challenge" → "Consider how to address the challenge"
- "Joe Wapshott and Charlie Farmer will talk to Freddy" → "Talk to Freddy with Charlie Farmer"

Return a JSON array of strings, each being a task title. If there are no actions for ${config.yourName}, return an empty array.

Return ONLY the JSON array, no other text.`;

  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.claudeApiKey,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    }),
    muteHttpExceptions: true
  });

  const responseCode = response.getResponseCode();
  const responseBody = response.getContentText();

  if (responseCode !== 200) {
    Logger.log(`Claude API error: ${responseCode} - ${responseBody}`);
    throw new Error(`Claude API returned ${responseCode}`);
  }

  const result = JSON.parse(responseBody);
  const content = result.content[0].text;

  try {
    // Parse the JSON array from Claude's response
    // Strip markdown code blocks if present
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    const actions = JSON.parse(jsonContent);
    return Array.isArray(actions) ? actions : [];
  } catch (e) {
    Logger.log(`Failed to parse Claude response: ${content}`);
    return [];
  }
}

// -----------------------------------------------------------------------------
// SEND ACTION TO THINGS VIA MAIL DROP
// -----------------------------------------------------------------------------

function sendToThings(actionTitle, meetingTitle, meetingDate, config) {
  const formattedDate = Utilities.formatDate(meetingDate, Session.getScriptTimeZone(), 'dd MMM yyyy');

  const emailBody = `From meeting: ${meetingTitle}
Date: ${formattedDate}

---
Auto-captured from Google Meet transcript`;

  GmailApp.sendEmail(
    config.thingsEmailAddress,
    actionTitle,
    emailBody
  );

  Logger.log(`Sent to Things: ${actionTitle}`);
}
