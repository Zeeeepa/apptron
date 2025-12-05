/**
 * Project Type Detector - Detect project configuration and requirements
 */

export class ProjectDetector {
  /**
   * Detect project configuration from files
   */
  static detect(files) {
    const fileSet = new Set(files.map(f => f.toLowerCase()));
    
    return {
      type: this.detectType(fileSet, files),
      packageManager: this.detectPackageManager(fileSet),
      buildTool: this.detectBuildTool(fileSet),
      framework: this.detectFramework(fileSet, files),
      runtime: this.detectRuntime(fileSet),
      hasTests: this.hasTests(fileSet),
      hasDocker: fileSet.has('dockerfile') || fileSet.has('docker-compose.yml')
    };
  }
  
  /**
   * Detect project type
   */
  static detectType(fileSet, files) {
    if (fileSet.has('package.json')) return 'nodejs';
    if (fileSet.has('requirements.txt') || fileSet.has('pyproject.toml')) return 'python';
    if (fileSet.has('go.mod')) return 'golang';
    if (fileSet.has('cargo.toml')) return 'rust';
    if (fileSet.has('composer.json')) return 'php';
    if (fileSet.has('gemfile')) return 'ruby';
    if (fileSet.has('pom.xml') || fileSet.has('build.gradle')) return 'java';
    if (files.some(f => f.endsWith('.csproj')) || files.some(f => f.endsWith('.sln'))) return 'csharp';
    return 'unknown';
  }
  
  /**
   * Detect package manager
   */
  static detectPackageManager(fileSet) {
    if (fileSet.has('package-lock.json')) return 'npm';
    if (fileSet.has('yarn.lock')) return 'yarn';
    if (fileSet.has('pnpm-lock.yaml')) return 'pnpm';
    if (fileSet.has('bun.lockb')) return 'bun';
    if (fileSet.has('requirements.txt')) return 'pip';
    if (fileSet.has('pipfile')) return 'pipenv';
    if (fileSet.has('poetry.lock')) return 'poetry';
    if (fileSet.has('go.mod')) return 'go';
    if (fileSet.has('cargo.lock')) return 'cargo';
    if (fileSet.has('composer.lock')) return 'composer';
    if (fileSet.has('gemfile.lock')) return 'bundler';
    return null;
  }
  
  /**
   * Detect build tool
   */
  static detectBuildTool(fileSet) {
    if (fileSet.has('webpack.config.js')) return 'webpack';
    if (fileSet.has('vite.config.js') || fileSet.has('vite.config.ts')) return 'vite';
    if (fileSet.has('rollup.config.js')) return 'rollup';
    if (fileSet.has('gulpfile.js')) return 'gulp';
    if (fileSet.has('gruntfile.js')) return 'grunt';
    if (fileSet.has('makefile')) return 'make';
    if (fileSet.has('rakefile')) return 'rake';
    return null;
  }
  
  /**
   * Detect framework
   */
  static detectFramework(fileSet, files) {
    // JavaScript/TypeScript frameworks
    if (fileSet.has('next.config.js') || fileSet.has('next.config.mjs')) return 'nextjs';
    if (fileSet.has('nuxt.config.js') || fileSet.has('nuxt.config.ts')) return 'nuxtjs';
    if (fileSet.has('svelte.config.js')) return 'svelte';
    if (fileSet.has('astro.config.mjs')) return 'astro';
    if (fileSet.has('gatsby-config.js')) return 'gatsby';
    if (fileSet.has('angular.json')) return 'angular';
    if (files.some(f => f.startsWith('app.') && f.includes('vue'))) return 'vue';
    if (files.some(f => f.startsWith('app.') && (f.includes('jsx') || f.includes('tsx')))) return 'react';
    
    // Python frameworks
    if (fileSet.has('manage.py')) return 'django';
    if (files.some(f => f.includes('flask'))) return 'flask';
    if (files.some(f => f.includes('fastapi'))) return 'fastapi';
    
    // PHP frameworks
    if (fileSet.has('artisan')) return 'laravel';
    if (fileSet.has('symfony.lock')) return 'symfony';
    
    // Ruby frameworks
    if (fileSet.has('config.ru')) return 'rails';
    
    return null;
  }
  
  /**
   * Detect runtime requirements
   */
  static detectRuntime(fileSet) {
    const runtime = {
      node: fileSet.has('package.json'),
      python: fileSet.has('requirements.txt') || fileSet.has('pyproject.toml'),
      go: fileSet.has('go.mod'),
      rust: fileSet.has('cargo.toml'),
      php: fileSet.has('composer.json'),
      ruby: fileSet.has('gemfile'),
      java: fileSet.has('pom.xml') || fileSet.has('build.gradle')
    };
    
    return Object.keys(runtime).filter(key => runtime[key]);
  }
  
  /**
   * Check if project has tests
   */
  static hasTests(fileSet) {
    const testIndicators = [
      'test', 'tests', '__tests__', 'spec', 'specs',
      'jest.config.js', 'vitest.config.js', 'pytest.ini',
      'phpunit.xml', 'testcafe.json'
    ];
    
    return Array.from(fileSet).some(file => 
      testIndicators.some(indicator => file.includes(indicator))
    );
  }
  
  /**
   * Get recommended run command
   */
  static getRunCommand(projectInfo) {
    const { type, framework, packageManager } = projectInfo;
    
    // Node.js projects
    if (type === 'nodejs') {
      const pm = packageManager || 'npm';
      
      if (framework === 'nextjs') return `${pm} run dev`;
      if (framework === 'nuxtjs') return `${pm} run dev`;
      if (framework === 'vite') return `${pm} run dev`;
      if (framework === 'gatsby') return `${pm} run develop`;
      if (framework === 'astro') return `${pm} run dev`;
      if (framework === 'svelte') return `${pm} run dev`;
      
      return `${pm} run dev || ${pm} start`;
    }
    
    // Python projects
    if (type === 'python') {
      if (framework === 'django') return 'python manage.py runserver';
      if (framework === 'flask') return 'flask run --host=0.0.0.0';
      if (framework === 'fastapi') return 'uvicorn main:app --host=0.0.0.0';
      return 'python main.py || python app.py';
    }
    
    // Go projects
    if (type === 'golang') {
      return 'go run .';
    }
    
    // Rust projects
    if (type === 'rust') {
      return 'cargo run';
    }
    
    // PHP projects
    if (type === 'php') {
      if (framework === 'laravel') return 'php artisan serve';
      return 'php -S 0.0.0.0:8000';
    }
    
    // Ruby projects
    if (type === 'ruby') {
      if (framework === 'rails') return 'rails server';
      return 'ruby app.rb';
    }
    
    return null;
  }
  
  /**
   * Get install command
   */
  static getInstallCommand(projectInfo) {
    const { type, packageManager } = projectInfo;
    
    if (type === 'nodejs') {
      if (packageManager === 'yarn') return 'yarn install';
      if (packageManager === 'pnpm') return 'pnpm install';
      if (packageManager === 'bun') return 'bun install';
      return 'npm install';
    }
    
    if (type === 'python') {
      if (packageManager === 'poetry') return 'poetry install';
      if (packageManager === 'pipenv') return 'pipenv install';
      return 'pip install -r requirements.txt';
    }
    
    if (type === 'golang') return 'go mod download';
    if (type === 'rust') return 'cargo fetch';
    if (type === 'php') return 'composer install';
    if (type === 'ruby') return 'bundle install';
    
    return null;
  }
}

export default ProjectDetector;

