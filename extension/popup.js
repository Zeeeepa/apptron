// Popup script for Apptron extension

document.addEventListener('DOMContentLoaded', async () => {
  await loadSessions();
  
  // Set up event listeners
  document.getElementById('help-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/tractordev/apptron#readme' });
  });
  
  document.getElementById('settings-link').addEventListener('click', (e) => {
    e.preventDefault();
    showSettings();
  });
});

/**
 * Load and display active sessions
 */
async function loadSessions() {
  const container = document.getElementById('sessions-container');
  
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
    const sessions = response.sessions || [];
    
    if (sessions.length === 0) {
      showEmptyState(container);
      return;
    }
    
    container.innerHTML = '';
    sessions.forEach(session => {
      const card = createSessionCard(session);
      container.appendChild(card);
    });
    
  } catch (error) {
    console.error('Error loading sessions:', error);
    showError(container, 'Failed to load sessions');
  }
}

/**
 * Create a session card element
 */
function createSessionCard(session) {
  const card = document.createElement('div');
  card.className = 'card';
  
  const repoName = session.repoUrl.replace('https://github.com/', '');
  const duration = formatDuration(Date.now() - session.startTime);
  const status = session.status || 'loading';
  
  card.innerHTML = `
    <a href="#" class="card-title" data-tab-id="${session.tabId}">${repoName}</a>
    <div class="card-meta">
      <span class="status ${status}">${status}</span>
      <span style="margin-left: 8px;">${duration}</span>
    </div>
  `;
  
  // Handle click to switch to tab
  card.querySelector('.card-title').addEventListener('click', async (e) => {
    e.preventDefault();
    const tabId = parseInt(e.target.dataset.tabId);
    try {
      await chrome.tabs.update(tabId, { active: true });
      window.close();
    } catch (error) {
      console.error('Tab no longer exists:', error);
      await chrome.storage.local.remove(`apptron_session_${tabId}`);
      loadSessions(); // Refresh the list
    }
  });
  
  return card;
}

/**
 * Show empty state
 */
function showEmptyState(container) {
  container.innerHTML = `
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
        <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
      </svg>
      <p>No active sessions</p>
      <p style="font-size: 12px; margin-bottom: 16px;">Visit a GitHub repository and click "Run in Browser"</p>
      <a href="https://github.com/explore" target="_blank" class="btn btn-primary">Explore GitHub</a>
    </div>
  `;
}

/**
 * Show error message
 */
function showError(container, message) {
  container.innerHTML = `
    <div class="empty-state">
      <p style="color: #d73a49;">${message}</p>
    </div>
  `;
}

/**
 * Format duration
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Show settings (placeholder)
 */
function showSettings() {
  alert('Settings coming soon!\n\nFuture features:\n• Claude API key configuration\n• Custom Apptron instance URL\n• Default runtime preferences');
}

