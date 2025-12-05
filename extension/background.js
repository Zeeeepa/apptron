// Background service worker for Deploy to Apptron extension

const APPTRON_URL = 'https://apptron.dev';

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openConfigDialog') {
    handleOpenConfigDialog(message.data, sender.tab.id);
  } else if (message.action === 'deployToApptron') {
    handleDeployment(message.data);
  }
  return true;
});

// Open configuration dialog in a new tab
async function handleOpenConfigDialog(data, tabId) {
  try {
    // Store the deployment data temporarily
    await chrome.storage.local.set({
      pendingDeployment: data,
      sourceTabId: tabId
    });

    // Open config page
    const configUrl = chrome.runtime.getURL('env-config.html');
    chrome.tabs.create({ url: configUrl });
  } catch (error) {
    console.error('Failed to open config dialog:', error);
  }
}

// Handle actual deployment to Apptron
async function handleDeployment(data) {
  const { owner, repo, branch, envVars, projectTypes } = data;

  try {
    // Build Apptron URL with parameters
    const url = new URL(APPTRON_URL);
    url.searchParams.set('repo', `${owner}/${repo}`);
    url.searchParams.set('branch', branch);
    
    // Encode environment variables as JSON
    if (envVars && Object.keys(envVars).length > 0) {
      url.searchParams.set('env', btoa(JSON.stringify(envVars)));
    }

    // Add project type hint
    if (projectTypes && projectTypes.length > 0) {
      url.searchParams.set('type', projectTypes[0]);
    }

    // Open Apptron in a new tab
    chrome.tabs.create({ url: url.toString() });

    // Clear pending deployment
    await chrome.storage.local.remove('pendingDeployment');
  } catch (error) {
    console.error('Deployment failed:', error);
    // Notify user of failure
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Deployment Failed',
      message: `Failed to deploy to Apptron: ${error.message}`
    });
  }
}

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Deploy to Apptron extension installed');
    
    // Open welcome page
    chrome.tabs.create({
      url: 'https://apptron.dev'
    });
  }
});

