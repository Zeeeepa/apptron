/**
 * GitHub Clone UI Component
 * Provides UI for showing GitHub clone/setup progress
 */

import { GitHubState, githubStateMachine } from './github-state.js';

/**
 * Update the loader dialog with GitHub-specific progress
 * @param {Object} stateData - State data from GitHubStateMachine
 */
export function updateLoaderWithGitHubProgress(stateData) {
    const loader = document.getElementById('loader');
    if (!loader) {
        return;
    }

    const paragraph = loader.querySelector('p');
    if (!paragraph) {
        return;
    }

    // Update text based on state
    const { state, progress, message } = stateData;
    
    let displayMessage = message || getDefaultMessage(state);
    
    // Add progress percentage if available and not 0 or 100
    if (progress > 0 && progress < 100) {
        displayMessage += ` (${Math.round(progress)}%)`;
    }
    
    paragraph.textContent = displayMessage;

    // Add spinner icon if not in ERROR or READY state
    if (state !== GitHubState.ERROR && state !== GitHubState.READY) {
        if (!paragraph.querySelector('.spinner')) {
            const spinner = document.createElement('span');
            spinner.className = 'spinner';
            spinner.textContent = ' ⏳';
            paragraph.appendChild(spinner);
        }
    }
}

/**
 * Get default message for a state
 * @param {string} state - Current state
 * @returns {string} Default message
 */
function getDefaultMessage(state) {
    const messages = {
        [GitHubState.IDLE]: 'Initializing...',
        [GitHubState.PARSING_URL]: 'Parsing GitHub URL...',
        [GitHubState.VALIDATING_REPO]: 'Validating repository...',
        [GitHubState.CLONING]: 'Cloning repository...',
        [GitHubState.DETECTING_PROJECT_TYPE]: 'Detecting project type...',
        [GitHubState.INSTALLING_DEPS]: 'Installing dependencies...',
        [GitHubState.RUNNING_SETUP]: 'Running setup scripts...',
        [GitHubState.READY]: 'Environment ready! 🎉',
        [GitHubState.ERROR]: 'An error occurred'
    };
    return messages[state] || 'Processing...';
}

/**
 * Show error in loader with retry button
 * @param {Object} errorData - Error information
 * @param {Function} retryCallback - Function to call on retry
 */
export function showGitHubError(errorData, retryCallback) {
    const loader = document.getElementById('loader');
    if (!loader) {
        return;
    }

    const paragraph = loader.querySelector('p');
    if (!paragraph) {
        return;
    }

    // Show error message
    const errorMessage = errorData.message || 'An unknown error occurred';
    paragraph.innerHTML = `
        <span style="color: #e82020;">❌ ${errorMessage}</span>
    `;

    // Add retry button if error is recoverable
    if (errorData.recoverable && retryCallback) {
        const retryButton = document.createElement('button');
        retryButton.textContent = 'Retry';
        retryButton.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: var(--brand-color, #506cf0);
            color: var(--brand-contrast-color, white);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        retryButton.onclick = retryCallback;
        paragraph.appendChild(retryButton);
    }

    // Add details button for stack trace (in development)
    if (errorData.stack && window.location.hostname === 'localhost') {
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Show Details';
        detailsButton.style.cssText = `
            margin-top: 0.5rem;
            margin-left: 0.5rem;
            padding: 0.5rem 1rem;
            background: #8f9095;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        detailsButton.onclick = () => {
            console.error('GitHub Error Details:', errorData);
            alert(errorData.stack);
        };
        paragraph.appendChild(detailsButton);
    }
}

/**
 * Show repository size warning
 * @param {number} sizeInMB - Repository size in megabytes
 * @returns {Promise<boolean>} True if user wants to proceed, false otherwise
 */
export async function showSizeWarning(sizeInMB) {
    return new Promise((resolve) => {
        const loader = document.getElementById('loader');
        if (!loader) {
            resolve(true);
            return;
        }

        const paragraph = loader.querySelector('p');
        if (!paragraph) {
            resolve(true);
            return;
        }

        let warningLevel = 'info';
        let warningMessage = `This repository is ${sizeInMB.toFixed(1)}MB.`;
        
        if (sizeInMB >= 500) {
            warningLevel = 'danger';
            warningMessage = `⚠️ This repository is very large (${sizeInMB.toFixed(1)}MB). Cloning may take several minutes and use significant bandwidth.`;
        } else if (sizeInMB >= 200) {
            warningLevel = 'warning';
            warningMessage = `⚠️ This repository is large (${sizeInMB.toFixed(1)}MB). Cloning may take a while.`;
        } else if (sizeInMB >= 50) {
            warningLevel = 'info';
            warningMessage = `ℹ️ This repository is ${sizeInMB.toFixed(1)}MB. Cloning will take a moment.`;
        } else {
            // No warning needed for small repos
            resolve(true);
            return;
        }

        paragraph.innerHTML = `
            <div style="text-align: center;">
                <p>${warningMessage}</p>
                <p style="margin-top: 0.5rem; font-size: 0.9em; color: #8f9095;">
                    A shallow clone will be used to minimize download size.
                </p>
            </div>
        `;

        // Add proceed button
        const proceedButton = document.createElement('button');
        proceedButton.textContent = 'Continue';
        proceedButton.style.cssText = `
            margin-top: 1rem;
            padding: 0.5rem 1.5rem;
            background: var(--brand-color, #506cf0);
            color: var(--brand-contrast-color, white);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;
        proceedButton.onclick = () => resolve(true);
        paragraph.appendChild(proceedButton);

        // Add cancel button for large repos
        if (sizeInMB >= 200) {
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.cssText = `
                margin-top: 1rem;
                margin-left: 0.5rem;
                padding: 0.5rem 1.5rem;
                background: #8f9095;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;
            cancelButton.onclick = () => resolve(false);
            paragraph.appendChild(cancelButton);
        }
    });
}

/**
 * Initialize GitHub UI
 * Sets up listeners for state changes and updates UI accordingly
 */
export function initializeGitHubUI() {
    // Subscribe to state machine changes
    githubStateMachine.subscribe((stateData, oldState) => {
        if (stateData.state === GitHubState.ERROR) {
            showGitHubError(stateData.error, () => {
                // Retry logic would go here
                console.log('Retry requested');
            });
        } else if (stateData.state === GitHubState.READY) {
            // Mark loader as complete
            const loader = document.getElementById('loader');
            if (loader && loader.loaded) {
                loader.loaded();
            }
        } else {
            updateLoaderWithGitHubProgress(stateData);
        }
    });

    console.log('GitHub UI initialized');
}

