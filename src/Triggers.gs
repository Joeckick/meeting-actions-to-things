// =============================================================================
// Trigger Management
// =============================================================================

/**
 * Set up automatic trigger - runs every 15 minutes
 */
function setupTrigger() {
  // Remove existing triggers first
  removeTrigger();
  
  ScriptApp.newTrigger('processNewTranscripts')
    .timeBased()
    .everyMinutes(15)
    .create();
  
  Logger.log('Trigger created: processNewTranscripts will run every 15 minutes');
}

/**
 * Remove automatic trigger
 */
function removeTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;
  
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'processNewTranscripts') {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  }
  
  if (removed > 0) {
    Logger.log(`Removed ${removed} existing trigger(s)`);
  }
}

/**
 * List all triggers for this project
 */
function listTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  
  if (triggers.length === 0) {
    Logger.log('No triggers configured');
    return;
  }
  
  Logger.log(`Found ${triggers.length} trigger(s):`);
  for (const trigger of triggers) {
    Logger.log(`  - ${trigger.getHandlerFunction()} (${trigger.getEventType()})`);
  }
}
