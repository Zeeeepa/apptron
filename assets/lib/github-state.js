/**
 * GitHub Clone State Machine
 * Tracks the state of GitHub repository cloning and setup process
 * 
 * States:
 * - IDLE: No GitHub operation in progress
 * - PARSING_URL: Parsing GitHub URL parameters
 * - VALIDATING_REPO: Checking if repository exists and is accessible
 * - CLONING: Cloning repository from GitHub
 * - DETECTING_PROJECT_TYPE: Analyzing project files to detect language/framework
 * - INSTALLING_DEPS: Installing project dependencies
 * - RUNNING_SETUP: Running custom setup scripts
 * - READY: Environment ready for use
 * - ERROR: An error occurred during setup
 */

export const GitHubState = {
    IDLE: 'idle',
    PARSING_URL: 'parsing_url',
    VALIDATING_REPO: 'validating_repo',
    CLONING: 'cloning',
    DETECTING_PROJECT_TYPE: 'detecting_project_type',
    INSTALLING_DEPS: 'installing_deps',
    RUNNING_SETUP: 'running_setup',
    READY: 'ready',
    ERROR: 'error'
};

export class GitHubStateMachine {
    constructor() {
        this.currentState = GitHubState.IDLE;
        this.progress = 0;
        this.message = '';
        this.error = null;
        this.metadata = {};
        this.listeners = [];
        
        // Try to restore state from sessionStorage
        this.restoreState();
    }

    /**
     * Transition to a new state
     * @param {string} newState - The new state from GitHubState enum
     * @param {Object} options - Additional options (progress, message, metadata)
     */
    setState(newState, options = {}) {
        const oldState = this.currentState;
        this.currentState = newState;
        
        if (options.progress !== undefined) {
            this.progress = Math.max(0, Math.min(100, options.progress));
        }
        
        if (options.message !== undefined) {
            this.message = options.message;
        }
        
        if (options.error !== undefined) {
            this.error = options.error;
        }
        
        if (options.metadata !== undefined) {
            this.metadata = { ...this.metadata, ...options.metadata };
        }

        // Persist state to sessionStorage
        this.persistState();
        
        // Notify all listeners
        const stateData = this.getStateData();
        console.log('State transition:', oldState, '→', newState, stateData);
        this.listeners.forEach(listener => {
            try {
                listener(stateData, oldState);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    }

    /**
     * Get current state data
     * @returns {Object} Current state information
     */
    getStateData() {
        return {
            state: this.currentState,
            progress: this.progress,
            message: this.message,
            error: this.error,
            metadata: this.metadata,
            timestamp: Date.now()
        };
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback - Called when state changes with (stateData, oldState)
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback) {
        this.listeners.push(callback);
        // Immediately call with current state
        callback(this.getStateData(), this.currentState);
        
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Update progress within current state
     * @param {number} progress - Progress percentage (0-100)
     * @param {string} message - Optional progress message
     */
    updateProgress(progress, message) {
        this.progress = Math.max(0, Math.min(100, progress));
        if (message !== undefined) {
            this.message = message;
        }
        this.persistState();
        
        const stateData = this.getStateData();
        this.listeners.forEach(listener => {
            try {
                listener(stateData, this.currentState);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    }

    /**
     * Set error state
     * @param {Error|string} error - Error object or message
     * @param {boolean} recoverable - Whether error is recoverable
     */
    setError(error, recoverable = false) {
        const errorMessage = error instanceof Error ? error.message : error;
        this.setState(GitHubState.ERROR, {
            error: {
                message: errorMessage,
                recoverable,
                stack: error instanceof Error ? error.stack : undefined
            },
            message: `Error: ${errorMessage}`
        });
    }

    /**
     * Reset state machine to IDLE
     */
    reset() {
        this.currentState = GitHubState.IDLE;
        this.progress = 0;
        this.message = '';
        this.error = null;
        this.metadata = {};
        this.clearPersistedState();
        
        this.listeners.forEach(listener => {
            try {
                listener(this.getStateData(), GitHubState.ERROR);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    }

    /**
     * Persist state to sessionStorage
     * This allows state to survive page refreshes during long operations
     */
    persistState() {
        try {
            const stateData = {
                state: this.currentState,
                progress: this.progress,
                message: this.message,
                error: this.error,
                metadata: this.metadata,
                timestamp: Date.now()
            };
            sessionStorage.setItem('apptron_github_state', JSON.stringify(stateData));
        } catch (error) {
            console.error('Failed to persist GitHub state:', error);
        }
    }

    /**
     * Restore state from sessionStorage
     */
    restoreState() {
        try {
            const stored = sessionStorage.getItem('apptron_github_state');
            if (stored) {
                const stateData = JSON.parse(stored);
                
                // Only restore if timestamp is recent (within 5 minutes)
                const age = Date.now() - stateData.timestamp;
                if (age < 5 * 60 * 1000) {
                    this.currentState = stateData.state;
                    this.progress = stateData.progress;
                    this.message = stateData.message;
                    this.error = stateData.error;
                    this.metadata = stateData.metadata;
                    console.log('Restored GitHub state:', stateData);
                } else {
                    this.clearPersistedState();
                }
            }
        } catch (error) {
            console.error('Failed to restore GitHub state:', error);
            this.clearPersistedState();
        }
    }

    /**
     * Clear persisted state from sessionStorage
     */
    clearPersistedState() {
        try {
            sessionStorage.removeItem('apptron_github_state');
        } catch (error) {
            console.error('Failed to clear GitHub state:', error);
        }
    }

    /**
     * Get human-readable state name
     * @returns {string}
     */
    getStateName() {
        const stateNames = {
            [GitHubState.IDLE]: 'Idle',
            [GitHubState.PARSING_URL]: 'Parsing URL',
            [GitHubState.VALIDATING_REPO]: 'Validating Repository',
            [GitHubState.CLONING]: 'Cloning Repository',
            [GitHubState.DETECTING_PROJECT_TYPE]: 'Detecting Project Type',
            [GitHubState.INSTALLING_DEPS]: 'Installing Dependencies',
            [GitHubState.RUNNING_SETUP]: 'Running Setup',
            [GitHubState.READY]: 'Ready',
            [GitHubState.ERROR]: 'Error'
        };
        return stateNames[this.currentState] || this.currentState;
    }
}

// Create singleton instance
export const githubStateMachine = new GitHubStateMachine();

