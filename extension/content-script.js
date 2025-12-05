(function() {
  'use strict';

  const APPTRON_URL = 'https://apptron.dev';

  // Check if we're on a repository page
  function isRepoPage() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p);
    
    // Must be /{owner}/{repo} format
    if (parts.length < 2) return false;
    
    // Exclude special pages
    const excluded = ['settings', 'pulls', 'issues', 'actions', 'wiki', 'projects', 'security'];
    return !excluded.includes(parts[2]);
  }

  // Create the "Deploy to Apptron" button
  function createDeployButton() {
    const button = document.createElement('button');
    button.className = 'apptron-deploy-btn';
    button.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: text-bottom; margin-right: 6px;">
        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
      </svg>
      Deploy to Apptron
    `;
    button.setAttribute('data-apptron-deploy', 'true');
    button.addEventListener('click', handleDeploy);
    return button;
  }

  // Handle deploy button click
  async function handleDeploy(event) {
    event.preventDefault();
    const button = event.currentTarget;
    
    // Disable button and show loading
    button.disabled = true;
    button.innerHTML = `
      <span class="apptron-spinner"></span>
      Analyzing project...
    `;

    try {
      const githubAPI = new GitHubAPI();
      const envParser = new EnvParser();
      
      // Get repository info
      const repoInfo = githubAPI.getRepoInfo();
      if (!repoInfo) {
        throw new Error('Could not determine repository information');
      }

      const { owner, repo, branch } = repoInfo;

      // Find config files
      const configFiles = await githubAPI.findConfigFiles(owner, repo, branch);
      
      // Parse environment variables from all sources
      let allVariables = [];
      
      for (const filepath of configFiles) {
        const content = await githubAPI.fetchFile(owner, repo, branch, filepath);
        if (!content) continue;

        if (filepath.match(/\.env/i)) {
          const vars = envParser.parseEnvFile(content);
          allVariables = envParser.mergeVariables(allVariables, vars);
        } else if (filepath === 'package.json') {
          const vars = envParser.parsePackageJson(content);
          allVariables = envParser.mergeVariables(allVariables, vars);
        } else if (filepath === 'docker-compose.yml') {
          const vars = envParser.parseDockerCompose(content);
          allVariables = envParser.mergeVariables(allVariables, vars);
        }
      }

      // Detect project type
      const projectTypes = await githubAPI.detectProjectType(owner, repo, branch);

      // Send message to background script to open config dialog
      chrome.runtime.sendMessage({
        action: 'openConfigDialog',
        data: {
          owner,
          repo,
          branch,
          variables: allVariables,
          projectTypes,
          configFiles
        }
      });

    } catch (error) {
      console.error('Deploy failed:', error);
      button.disabled = false;
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: text-bottom; margin-right: 6px;">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
        </svg>
        Deploy to Apptron
      `;
      alert(`Failed to analyze project: ${error.message}`);
    }
  }

  // Insert button into the page
  function insertButton() {
    // Check if button already exists
    if (document.querySelector('[data-apptron-deploy]')) {
      return;
    }

    // Find the ref selector (branch dropdown) and insert after it
    const refSelector = document.querySelector('[data-testid="ref-selector-hotkey-button"]');
    
    if (refSelector && refSelector.parentElement) {
      const button = createDeployButton();
      refSelector.parentElement.insertBefore(button, refSelector.nextSibling);
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
        // Check if the main content area changed
        if (mutation.target.id === 'js-repo-pjax-container' || 
            mutation.target.classList?.contains('application-main')) {
          setTimeout(insertButton, 100);
          break;
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

