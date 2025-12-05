// Configuration page script
(async function() {
  'use strict';

  // Load pending deployment data
  const { pendingDeployment, sourceTabId } = await chrome.storage.local.get([
    'pendingDeployment',
    'sourceTabId'
  ]);

  if (!pendingDeployment) {
    document.body.innerHTML = '<div class="container"><div class="no-vars"><h2>No pending deployment</h2><p>Please click "Deploy to Apptron" button on a GitHub repository page.</p></div></div>';
    return;
  }

  const { owner, repo, branch, variables, projectTypes, configFiles } = pendingDeployment;

  // Update UI with repository info
  document.getElementById('repoName').textContent = `${owner}/${repo}`;
  document.getElementById('repoBranch').textContent = branch;

  // Show project types
  const typesContainer = document.getElementById('projectTypes');
  if (projectTypes && projectTypes.length > 0) {
    typesContainer.innerHTML = projectTypes
      .map(type => `<span class="badge">${type}</span>`)
      .join('');
  }

  // Render environment variables form
  const envContainer = document.getElementById('envVariables');
  
  if (!variables || variables.length === 0) {
    envContainer.innerHTML = `
      <div class="no-vars">
        <p>✅ No environment variables required!</p>
        <p style="font-size: 13px; margin-top: 8px;">This project doesn't require any configuration. Click "Deploy Now" to continue.</p>
      </div>
    `;
  } else {
    envContainer.innerHTML = variables.map(v => {
      const inputId = `env_${v.key}`;
      
      let inputHTML;
      if (v.type === 'boolean') {
        inputHTML = `
          <div class="checkbox-group">
            <input type="checkbox" id="${inputId}" name="${v.key}" ${v.defaultValue === 'true' ? 'checked' : ''}>
            <label for="${inputId}">${v.description || v.key}</label>
          </div>
        `;
      } else if (v.type === 'select' && v.options) {
        inputHTML = `
          <select class="env-input" id="${inputId}" name="${v.key}" ${v.isRequired ? 'required' : ''}>
            ${v.options.map(opt => `
              <option value="${opt}" ${opt === v.defaultValue ? 'selected' : ''}>${opt}</option>
            `).join('')}
          </select>
        `;
      } else {
        inputHTML = `
          <input 
            type="${v.type}" 
            class="env-input" 
            id="${inputId}" 
            name="${v.key}" 
            placeholder="${v.defaultValue || `Enter ${v.key}`}"
            value="${v.defaultValue || ''}"
            ${v.isRequired ? 'required' : ''}
          >
        `;
      }

      return `
        <div class="env-group">
          <div class="env-label">
            <label for="${inputId}">${v.key}</label>
            ${v.isRequired ? '<span class="required-badge">Required</span>' : ''}
          </div>
          ${v.description ? `<div class="env-description">${v.description}</div>` : ''}
          ${inputHTML}
        </div>
      `;
    }).join('');
  }

  // Handle form submission
  document.getElementById('envForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const deployBtn = document.getElementById('deployBtn');
    deployBtn.disabled = true;
    deployBtn.innerHTML = '<div class="spinner"></div> Deploying...';

    try {
      // Collect environment variables
      const envVars = {};
      const formData = new FormData(e.target);
      
      for (const [key, value] of formData.entries()) {
        if (value) {
          envVars[key] = value;
        }
      }

      // Handle checkboxes separately
      variables.forEach(v => {
        if (v.type === 'boolean') {
          const checkbox = document.getElementById(`env_${v.key}`);
          envVars[v.key] = checkbox.checked ? 'true' : 'false';
        }
      });

      // Send deployment request to background script
      chrome.runtime.sendMessage({
        action: 'deployToApptron',
        data: {
          owner,
          repo,
          branch,
          envVars,
          projectTypes
        }
      });

      // Show success message
      document.body.innerHTML = `
        <div class="container">
          <div class="no-vars">
            <h2>🎉 Deployment Started!</h2>
            <p style="margin: 20px 0;">Your project is being deployed to Apptron.</p>
            <p style="font-size: 13px; color: #718096;">A new tab will open with your deployment environment.</p>
            <button class="btn btn-primary" onclick="window.close()" style="margin-top: 24px; max-width: 200px;">
              Close This Tab
            </button>
          </div>
        </div>
      `;

      // Auto-close after a delay
      setTimeout(() => window.close(), 3000);

    } catch (error) {
      console.error('Deployment failed:', error);
      alert(`Deployment failed: ${error.message}`);
      deployBtn.disabled = false;
      deployBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
        </svg>
        Deploy Now
      `;
    }
  });

  // Handle cancel button
  document.getElementById('cancelBtn').addEventListener('click', () => {
    chrome.storage.local.remove('pendingDeployment');
    window.close();
  });
})();

