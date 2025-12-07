// Environment file parser
class EnvParser {
  /**
   * Parse .env file content
   */
  parseEnvFile(content) {
    if (!content) return [];

    const lines = content.split('\n');
    const variables = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Parse KEY=VALUE or KEY=
      const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/i);
      if (match) {
        const [, key, value] = match;
        
        // Extract default value (remove quotes)
        let defaultValue = value.trim();
        if (defaultValue.startsWith('"') && defaultValue.endsWith('"')) {
          defaultValue = defaultValue.slice(1, -1);
        } else if (defaultValue.startsWith("'") && defaultValue.endsWith("'")) {
          defaultValue = defaultValue.slice(1, -1);
        }

        // Try to infer variable type and if it's required
        const isRequired = !defaultValue || defaultValue.includes('YOUR_') || defaultValue.includes('CHANGE_ME');
        const type = this.inferType(key, defaultValue);
        const description = this.inferDescription(key);

        variables.push({
          key,
          defaultValue,
          type,
          isRequired,
          description
        });
      }
    }

    return variables;
  }

  /**
   * Parse package.json for additional config
   */
  parsePackageJson(content) {
    if (!content) return [];

    try {
      const pkg = JSON.parse(content);
      const variables = [];

      // Check for common environment variables in scripts
      if (pkg.scripts) {
        const scriptContent = JSON.stringify(pkg.scripts);
        
        // Common Node.js env vars
        if (scriptContent.includes('PORT')) {
          variables.push({
            key: 'PORT',
            defaultValue: '3000',
            type: 'number',
            isRequired: false,
            description: 'Server port'
          });
        }

        if (scriptContent.includes('NODE_ENV')) {
          variables.push({
            key: 'NODE_ENV',
            defaultValue: 'development',
            type: 'select',
            options: ['development', 'production', 'test'],
            isRequired: false,
            description: 'Node environment'
          });
        }
      }

      return variables;
    } catch (error) {
      console.error('Failed to parse package.json:', error);
      return [];
    }
  }

  /**
   * Parse docker-compose.yml for environment variables
   */
  parseDockerCompose(content) {
    if (!content) return [];

    const variables = [];
    
    // Simple regex-based parsing for environment variables
    const envRegex = /[-\s]([A-Z_][A-Z0-9_]*)\s*[:=]\s*([^\n]*)/gi;
    let match;

    while ((match = envRegex.exec(content)) !== null) {
      const [, key, value] = match;
      
      // Skip if it's referencing another env var
      if (value.trim().startsWith('${')) {
        const varName = value.match(/\$\{([^}]+)\}/)?.[1];
        if (varName && !variables.find(v => v.key === varName)) {
          variables.push({
            key: varName,
            defaultValue: '',
            type: 'text',
            isRequired: true,
            description: `Required by docker-compose`
          });
        }
      }
    }

    return variables;
  }

  /**
   * Infer variable type from key name
   */
  inferType(key) {
    key = key.toUpperCase();
    
    if (key.includes('PORT')) return 'number';
    if (key.includes('PASSWORD') || key.includes('SECRET') || key.includes('KEY')) return 'password';
    if (key.includes('EMAIL')) return 'email';
    if (key.includes('URL') || key.includes('URI')) return 'url';
    if (key.includes('ENABLE') || key.includes('DISABLE')) return 'boolean';
    
    return 'text';
  }

  /**
   * Infer description from key name
   */
  inferDescription(key) {
    const words = key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return words.join(' ');
  }

  /**
   * Merge variables from multiple sources (deduplicate by key)
   */
  mergeVariables(...variableSets) {
    const merged = new Map();

    for (const variables of variableSets) {
      for (const variable of variables) {
        if (!merged.has(variable.key)) {
          merged.set(variable.key, variable);
        }
      }
    }

    return Array.from(merged.values());
  }

  /**
   * Convert variables to .env format
   */
  toEnvFormat(variables) {
    return variables
      .map(v => `${v.key}=${v.value || v.defaultValue || ''}`)
      .join('\n');
  }
}

// Make available globally
if (typeof window !== 'undefined') {
  window.EnvParser = EnvParser;
}

