// Content script for GitHub pages
// Detects repositories and adds "Run in Apptron" button

(function() {
  'use strict';
  
  // Check if we're on a repository page
  function isRepoPage() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    return pathParts.length >= 2 && !pathParts.includes('search');
  }
  
  // Extract repository information from the page
  function getRepoInfo() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) return null;
    
    const owner = pathParts[0];
    const repo = pathParts[1];
    
    // Get default branch
    const branchElement = document.querySelector('[data-hotkey="w"] span');
    const branch = branchElement?.textContent?.trim() || 'main';
    
    // Detect language
    const languageElement = document.querySelector('[itemprop="programmingLanguage"]');
    const language = languageElement?.textContent?.trim() || 'unknown';
    
    // Detect project type by looking for common files
    const projectType = detectProjectType();
    
    return {
      owner,
      repo,
      branch,
      language,
      projectType,
      url: `https://github.com/${owner}/${repo}`
    };
  }
  
  // Detect project type based on visible files
  function detectProjectType() {
    const files = Array.from(document.querySelectorAll('[role="rowheader"]'))
      .map(el => el.textContent.trim().toLowerCase());
    
    if (files.includes('package.json')) return 'nodejs';
    if (files.includes('requirements.txt')) return 'python';
    if (files.includes('go.mod')) return 'golang';
    if (files.includes('cargo.toml')) return 'rust';
    if (files.includes('composer.json')) return 'php';
    if (files.includes('gemfile')) return 'ruby';
    
    return 'unknown';
  }
  
  // Create the "Run in Apptron" button
  function createRunButton() {
    const button = document.createElement('button');
    button.className = 'apptron-run-btn';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
        <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
      </svg>
      <span>Run in Browser</span>
    `;
    button.title = 'Run this repository in your browser with Apptron';
    
    button.addEventListener('click', handleRunClick);
    
    return button;
  }
  
  // Handle button click
  async function handleRunClick(e) {
    e.preventDefault();
    const button = e.currentTarget;
    
    // Show loading state
    button.classList.add('loading');
    button.disabled = true;
    button.innerHTML = `
      <svg class="spinner" width="16" height="16" viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="44" stroke-dashoffset="0">
          <animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
      <span>Opening...</span>
    `;
    
    const repoInfo = getRepoInfo();
    if (!repoInfo) {
      showError('Could not detect repository information');
      return;
    }
    
    try {
      // Send message to background script to open Apptron
      await chrome.runtime.sendMessage({
        action: 'openApptron',
        data: repoInfo
      });
      
      // Show success briefly
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg>
        <span>Opened!</span>
      `;
      
      setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
          </svg>
          <span>Run in Browser</span>
        `;
      }, 2000);
      
    } catch (error) {
      console.error('Error opening Apptron:', error);
      showError('Failed to open Apptron');
      button.classList.remove('loading');
      button.disabled = false;
    }
  }
  
  // Show error message
  function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'apptron-toast error';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  
  // Insert the button into the page
  function insertButton() {
    if (document.querySelector('.apptron-run-btn')) {
      return; // Button already exists
    }
    
    // Find the action bar (where Code button is)
    const actionBar = document.querySelector('[data-testid="get-repo-select-menu"]')?.parentElement;
    
    if (actionBar) {
      const button = createRunButton();
      actionBar.insertBefore(button, actionBar.firstChild);
    }
  }
  
  // Initialize
  function init() {
    if (!isRepoPage()) return;
    
    // Insert button when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insertButton);
    } else {
      insertButton();
    }
    
    // Re-insert on navigation (GitHub uses PJAX)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.target.classList?.contains('AppHeader')) {
          setTimeout(insertButton, 100);
        }
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Run initialization
  init();
})();

