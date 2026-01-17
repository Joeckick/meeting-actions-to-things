// =============================================================================
// Configuration
// Secrets are stored in Script Properties (not in code)
// Run setSecrets() once to configure, or set manually in Project Settings
// =============================================================================

/**
 * Get configuration from Script Properties
 * @returns {Object} Configuration object
 */
function getConfig() {
  const props = PropertiesService.getScriptProperties();

  return {
    thingsEmailAddress: props.getProperty('THINGS_EMAIL'),
    yourName: props.getProperty('YOUR_NAME'),
    claudeApiKey: props.getProperty('CLAUDE_API_KEY'),
    processedLabel: props.getProperty('PROCESSED_LABEL') || 'Actions-Extracted',
    gmailSearchQuery: props.getProperty('GMAIL_SEARCH_QUERY') || 'from:gemini-notes@google.com in:inbox -label:Actions-Extracted'
  };
}

/**
 * Set secrets in Script Properties
 * Run this once to configure your credentials
 *
 * Alternatively, set these manually:
 * 1. Open Apps Script editor
 * 2. Click Project Settings (gear icon)
 * 3. Scroll to Script Properties
 * 4. Add each property
 */
function setSecrets() {
  const props = PropertiesService.getScriptProperties();

  // ⚠️ UPDATE THESE VALUES THEN RUN THIS FUNCTION ONCE
  // After running, you can delete the values from this file

  props.setProperties({
    'THINGS_EMAIL': 'add-to-things-xxxxx@things.email',
    'YOUR_NAME': 'Your Name',
    'CLAUDE_API_KEY': 'sk-ant-xxxxx',
    'PROCESSED_LABEL': 'Actions-Extracted',
    'GMAIL_SEARCH_QUERY': 'from:gemini-notes@google.com in:inbox -label:Actions-Extracted'
  });

  Logger.log('Secrets saved to Script Properties');
  Logger.log('You can now remove the values from setSecrets() in the code');
}

/**
 * View current configuration (without exposing full API key)
 */
function viewConfig() {
  const config = getConfig();

  Logger.log('Current configuration:');
  Logger.log(`  THINGS_EMAIL: ${config.thingsEmailAddress || 'NOT SET'}`);
  Logger.log(`  YOUR_NAME: ${config.yourName || 'NOT SET'}`);
  Logger.log(`  CLAUDE_API_KEY: ${config.claudeApiKey ? '***' + config.claudeApiKey.slice(-8) : 'NOT SET'}`);
  Logger.log(`  PROCESSED_LABEL: ${config.processedLabel}`);
  Logger.log(`  GMAIL_SEARCH_QUERY: ${config.gmailSearchQuery}`);
}

/**
 * Clear all secrets from Script Properties
 */
function clearSecrets() {
  const props = PropertiesService.getScriptProperties();
  props.deleteAllProperties();
  Logger.log('All secrets cleared from Script Properties');
}
