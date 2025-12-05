// Background service worker for Apptron extension

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Apptron Runner extension installed');
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openApptron') {
    handleOpenApptron(request.data);
    sendResponse({ success: true });
  } else if (request.action === 'getStatus') {
    getApptronStatus(sendResponse);
    return true; // Keep channel open for async response
  }
});

/**
 * Open Apptron with the specified repository
 */
async function handleOpenApptron(repoData) {
  const { owner, repo, branch, language, projectType } = repoData;
  
  // Construct Apptron URL with repository parameters
  const apptronUrl = `https://apptron.dev/?` + new URLSearchParams({
    repo: `https://github.com/${owner}/${repo}`,
    branch: branch || 'main',
    lang: language || 'unknown',
    type: projectType || 'unknown',
    source: 'extension'
  }).toString();
  
  // Open in new tab
  try {
    const tab = await chrome.tabs.create({
      url: apptronUrl,
      active: true
    });
    
    // Store tab info for tracking
    chrome.storage.local.set({
      [`apptron_session_${tab.id}`]: {
        repoUrl: `https://github.com/${owner}/${repo}`,
        startTime: Date.now(),
        status: 'loading'
      }
    });
    
    console.log('Opened Apptron for:', `${owner}/${repo}`);
  } catch (error) {
    console.error('Failed to open Apptron:', error);
  }
}

/**
 * Get status of Apptron sessions
 */
async function getApptronStatus(sendResponse) {
  const storage = await chrome.storage.local.get(null);
  const sessions = Object.keys(storage)
    .filter(key => key.startsWith('apptron_session_'))
    .map(key => ({
      tabId: key.replace('apptron_session_', ''),
      ...storage[key]
    }));
  
  sendResponse({ sessions });
}

// Clean up closed tabs
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`apptron_session_${tabId}`);
});

