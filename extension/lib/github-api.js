// GitHub API helper for fetching repository information
class GitHubAPI {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.rawURL = 'https://raw.githubusercontent.com';
  }

  /**
   * Extract owner and repo from current GitHub page
   */
  getRepoInfo() {
    const pathParts = window.location.pathname.split('/').filter(p => p);
    if (pathParts.length < 2) return null;

    const owner = pathParts[0];
    const repo = pathParts[1];
    
    // Get current branch from UI
    const branchButton = document.querySelector('[data-testid="ref-selector-hotkey-button"]');
    const branch = branchButton?.textContent?.trim() || 'main';

    return { owner, repo, branch };
  }

  /**
   * Fetch file content from GitHub
   */
  async fetchFile(owner, repo, branch, filepath) {
    const url = `${this.rawURL}/${owner}/${repo}/${branch}/${filepath}`;
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      return await response.text();
    } catch (error) {
      console.error(`Failed to fetch ${filepath}:`, error);
      return null;
    }
  }

  /**
   * Fetch repository tree to find config files
   */
  async getRepoTree(owner, repo, branch) {
    const url = `${this.baseURL}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      const data = await response.json();
      return data.tree || [];
    } catch (error) {
      console.error('Failed to fetch repo tree:', error);
      return [];
    }
  }

  /**
   * Find all environment and config files
   */
  async findConfigFiles(owner, repo, branch) {
    const tree = await this.getRepoTree(owner, repo, branch);
    const configPatterns = [
      /\.env\.example$/i,
      /\.env\.template$/i,
      /\.env\.sample$/i,
      /^\.env$/i,
      /config\.example\.(json|yaml|yml|toml)$/i,
      /config\.sample\.(json|yaml|yml|toml)$/i,
      /docker-compose\.yml$/i,
      /package\.json$/i
    ];

    return tree
      .filter(item => item.type === 'blob')
      .filter(item => configPatterns.some(pattern => pattern.test(item.path)))
      .map(item => item.path);
  }

  /**
   * Detect project type and framework
   */
  async detectProjectType(owner, repo, branch) {
    const tree = await this.getRepoTree(owner, repo, branch);
    const files = tree.map(item => item.path);

    const types = [];

    // Node.js
    if (files.includes('package.json')) {
      types.push('nodejs');
      const packageJson = await this.fetchFile(owner, repo, branch, 'package.json');
      if (packageJson) {
        const pkg = JSON.parse(packageJson);
        if (pkg.dependencies?.next || pkg.devDependencies?.next) types.push('nextjs');
        if (pkg.dependencies?.react) types.push('react');
        if (pkg.dependencies?.vue) types.push('vue');
        if (pkg.dependencies?.express) types.push('express');
      }
    }

    // Python
    if (files.some(f => f === 'requirements.txt' || f === 'setup.py' || f === 'pyproject.toml')) {
      types.push('python');
      if (files.includes('manage.py')) types.push('django');
      if (files.some(f => f.includes('flask'))) types.push('flask');
    }

    // Go
    if (files.includes('go.mod')) {
      types.push('golang');
    }

    // Rust
    if (files.includes('Cargo.toml')) {
      types.push('rust');
    }

    // Docker
    if (files.includes('Dockerfile') || files.includes('docker-compose.yml')) {
      types.push('docker');
    }

    return types.length > 0 ? types : ['unknown'];
  }

  /**
   * Get repository README for additional info
   */
  async getReadme(owner, repo, branch) {
    const readmeFiles = ['README.md', 'README.MD', 'readme.md', 'README'];
    for (const filename of readmeFiles) {
      const content = await this.fetchFile(owner, repo, branch, filename);
      if (content) return content;
    }
    return null;
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.GitHubAPI = GitHubAPI;
}

