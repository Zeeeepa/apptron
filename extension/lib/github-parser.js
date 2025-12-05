/**
 * GitHub Parser - Extract repository information from GitHub pages
 */

export class GitHubParser {
  constructor() {
    this.cache = new Map();
  }
  
  /**
   * Check if current page is a repository page
   */
  isRepoPage() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    
    // Must have at least owner/repo
    if (parts.length < 2) return false;
    
    // Exclude search, explore, etc.
    const excludedPaths = ['search', 'explore', 'topics', 'trending', 'marketplace'];
    if (excludedPaths.includes(parts[0])) return false;
    
    return true;
  }
  
  /**
   * Extract full repository information
   */
  getRepoInfo() {
    const cacheKey = window.location.pathname;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const info = {
      owner: this.getOwner(),
      repo: this.getRepoName(),
      branch: this.getDefaultBranch(),
      language: this.getPrimaryLanguage(),
      languages: this.getAllLanguages(),
      projectType: this.detectProjectType(),
      stars: this.getStarCount(),
      description: this.getDescription(),
      files: this.getVisibleFiles(),
      url: this.getRepoUrl()
    };
    
    this.cache.set(cacheKey, info);
    return info;
  }
  
  /**
   * Get repository owner
   */
  getOwner() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    return pathParts[0] || null;
  }
  
  /**
   * Get repository name
   */
  getRepoName() {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    return pathParts[1] || null;
  }
  
  /**
   * Get default branch name
   */
  getDefaultBranch() {
    // Try to get from branch selector
    const branchBtn = document.querySelector('[data-hotkey="w"]');
    if (branchBtn) {
      const branchSpan = branchBtn.querySelector('span');
      if (branchSpan) {
        return branchSpan.textContent.trim();
      }
    }
    
    // Fallback to common defaults
    return 'main';
  }
  
  /**
   * Get primary programming language
   */
  getPrimaryLanguage() {
    const langElement = document.querySelector('[itemprop="programmingLanguage"]');
    if (langElement) {
      return langElement.textContent.trim();
    }
    
    // Try language bar
    const langBar = document.querySelector('.repository-lang-stats-graph');
    if (langBar) {
      const firstLang = langBar.querySelector('[aria-label]');
      if (firstLang) {
        const match = firstLang.getAttribute('aria-label').match(/^([^\d]+)/);
        return match ? match[1].trim() : null;
      }
    }
    
    return null;
  }
  
  /**
   * Get all languages used in repo
   */
  getAllLanguages() {
    const languages = [];
    const langElements = document.querySelectorAll('.repository-lang-stats-graph [aria-label]');
    
    langElements.forEach(el => {
      const label = el.getAttribute('aria-label');
      const match = label.match(/^([^\d]+)\s+([\d.]+)%/);
      if (match) {
        languages.push({
          name: match[1].trim(),
          percentage: parseFloat(match[2])
        });
      }
    });
    
    return languages;
  }
  
  /**
   * Detect project type based on files
   */
  detectProjectType() {
    const files = this.getVisibleFiles();
    const fileSet = new Set(files.map(f => f.toLowerCase()));
    
    // Check for specific project indicators
    if (fileSet.has('package.json')) {
      // Further detect framework
      if (fileSet.has('next.config.js') || fileSet.has('next.config.mjs')) return 'nextjs';
      if (fileSet.has('nuxt.config.js') || fileSet.has('nuxt.config.ts')) return 'nuxtjs';
      if (fileSet.has('vite.config.js') || fileSet.has('vite.config.ts')) return 'vite';
      if (fileSet.has('svelte.config.js')) return 'svelte';
      return 'nodejs';
    }
    
    if (fileSet.has('requirements.txt') || fileSet.has('pyproject.toml')) {
      if (fileSet.has('manage.py')) return 'django';
      if (fileSet.has('app.py') || fileSet.has('main.py')) return 'flask';
      return 'python';
    }
    
    if (fileSet.has('go.mod')) return 'golang';
    if (fileSet.has('cargo.toml')) return 'rust';
    if (fileSet.has('composer.json')) return 'php';
    if (fileSet.has('gemfile')) return 'ruby';
    if (fileSet.has('pom.xml') || fileSet.has('build.gradle')) return 'java';
    if (fileSet.has('*.csproj') || fileSet.has('*.sln')) return 'csharp';
    
    return 'unknown';
  }
  
  /**
   * Get visible files in file browser
   */
  getVisibleFiles() {
    const files = [];
    const fileElements = document.querySelectorAll('[role="rowheader"] a');
    
    fileElements.forEach(el => {
      const filename = el.textContent.trim();
      if (filename && filename !== '..') {
        files.push(filename);
      }
    });
    
    return files;
  }
  
  /**
   * Get star count
   */
  getStarCount() {
    const starBtn = document.querySelector('#repo-stars-counter-star');
    if (starBtn) {
      const count = starBtn.getAttribute('title') || starBtn.textContent;
      return this.parseNumber(count);
    }
    return 0;
  }
  
  /**
   * Get repository description
   */
  getDescription() {
    const descElement = document.querySelector('[data-testid="repository-description"]');
    return descElement ? descElement.textContent.trim() : '';
  }
  
  /**
   * Get full repository URL
   */
  getRepoUrl() {
    return `https://github.com/${this.getOwner()}/${this.getRepoName()}`;
  }
  
  /**
   * Parse number from string (handles K, M notation)
   */
  parseNumber(str) {
    if (!str) return 0;
    
    const clean = str.replace(/[^0-9.KM]/gi, '');
    const num = parseFloat(clean);
    
    if (clean.includes('K')) return num * 1000;
    if (clean.includes('M')) return num * 1000000;
    
    return num;
  }
  
  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export default new GitHubParser();

