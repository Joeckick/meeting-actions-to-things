// =============================================================================
// Test Functions
// =============================================================================

/**
 * Test extraction with sample transcript data
 * Use this to verify Claude API is working before processing real emails
 */
function testExtraction() {
  const config = getConfig();
  
  if (!config.claudeApiKey) {
    Logger.log('ERROR: Claude API key not set. Run setSecrets() first.');
    return;
  }
  
  const sampleTranscript = `
Summary

Yath Sivarajah, Joe Wapshott, and Charlie Farmer discussed refining Northstar metrics, with Yath Sivarajah agreeing to research alternatives to "time to value" and the team agreeing to "policies on risk" for core new STM policies. Joe Wapshott and Charlie Farmer added "not for now" priorities to the strategy and updated the core strategy Northstar metric and tagline.

Suggested next steps

→ Yath Sivarajah will research what other platform teams have for Northstar metrics and follow up, including figuring out another way to phrase the Platforms team strategy which is currently 'still make cover faster'.
→ Charlie Farmer will add descriptions to the not for now items in the document.
→ Yath Sivarajah will update the framing of the 'no faster' pillar based on the conversation with Hannah.
→ Joe Wapshott and Charlie Farmer will talk to Freddy together about the strategy and revenue targets, specifically removing the revenue target for taxi and framing the strategy as a long-term investment.
→ Joe Wapshott will consider how to address the challenge of having visibility on the LLM API opportunity and regulatory concerns with Yath Sivarajah.
`;

  Logger.log('Testing extraction with sample transcript...');
  Logger.log(`Looking for actions assigned to: ${config.yourName}`);
  Logger.log('---');
  
  const actions = extractActionsWithClaude(
    sampleTranscript, 
    'Product strategy - Part 2',
    config
  );
  
  Logger.log('Extracted actions:');
  if (actions.length === 0) {
    Logger.log('  (none found)');
  } else {
    actions.forEach((action, i) => {
      Logger.log(`  ${i + 1}. ${action}`);
    });
  }
  
  Logger.log('---');
  Logger.log('Test complete. If actions look correct, try testWithRealEmail()');
}

/**
 * Test with a real email but DON'T send to Things
 * Useful for checking extraction before enabling the full workflow
 */
function testWithRealEmail() {
  const config = getConfig();
  const threads = GmailApp.search(config.gmailSearchQuery, 0, 1);
  
  if (threads.length === 0) {
    Logger.log('No transcript emails found matching query:');
    Logger.log(`  ${config.gmailSearchQuery}`);
    Logger.log('Try marking a transcript email as unread.');
    return;
  }
  
  const message = threads[0].getMessages()[0];
  const subject = message.getSubject();
  const body = message.getPlainBody();
  
  Logger.log(`Found email: ${subject}`);
  Logger.log('---');
  Logger.log('Extracting actions (NOT sending to Things)...');
  
  const actions = extractActionsWithClaude(body, subject, config);
  
  Logger.log('Extracted actions:');
  if (actions.length === 0) {
    Logger.log('  (none found for you)');
  } else {
    actions.forEach((action, i) => {
      Logger.log(`  ${i + 1}. ${action}`);
    });
  }
  
  Logger.log('---');
  Logger.log('Email NOT marked as read, NOT labelled.');
  Logger.log('If actions look correct, run processNewTranscripts() to process for real.');
}

/**
 * Send a test task to Things to verify Mail Drop is working
 */
function testThingsMailDrop() {
  const config = getConfig();
  
  if (!config.thingsEmailAddress) {
    Logger.log('ERROR: Things email not set. Run setSecrets() first.');
    return;
  }
  
  const testTitle = 'Test task from Meeting Actions script';
  const testBody = `This is a test task to verify Mail Drop is working.

If you see this in your Things Inbox, the integration is working correctly.

You can delete this task.

---
Sent: ${new Date().toISOString()}`;

  GmailApp.sendEmail(config.thingsEmailAddress, testTitle, testBody);
  
  Logger.log('Test task sent to Things!');
  Logger.log('Check your Things Inbox in a few seconds.');
}
