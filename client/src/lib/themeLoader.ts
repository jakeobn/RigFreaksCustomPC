/**
 * Theme Loader
 * 
 * This module loads and applies custom themes from localStorage
 * and provides utilities for managing theme persistence.
 */

// Check if a theme is stored in localStorage and load it
export const loadStoredTheme = (): void => {
  try {
    // Backup component data before loading theme, to ensure we don't lose data
    const componentData = localStorage.getItem('rigfreaks-components');
    const componentsBackup = localStorage.getItem('rigfreaks-components-backup');
    
    // Backup components timestamp
    const componentTimestamp = localStorage.getItem('rigfreaks-components-timestamp');
    
    // Store whether custom components exist
    const hasCustomComponents = localStorage.getItem('rigfreaks-has-custom-components');
    
    // Now load the theme
    const storedTheme = localStorage.getItem('rigfreaks-theme');
    
    if (storedTheme) {
      const theme = JSON.parse(storedTheme);
      
      // Apply each CSS variable from the stored theme
      Object.keys(theme).forEach(variable => {
        document.documentElement.style.setProperty(variable, theme[variable]);
      });
      
      console.log('Custom theme loaded from storage');
    } else {
      console.log('No custom theme found, using default');
    }
    
    // Restore component data after theme is loaded
    if (componentData) {
      localStorage.setItem('rigfreaks-components', componentData);
    }
    
    if (componentsBackup) {
      localStorage.setItem('rigfreaks-components-backup', componentsBackup);
    }
    
    if (componentTimestamp) {
      localStorage.setItem('rigfreaks-components-timestamp', componentTimestamp);
    }
    
    if (hasCustomComponents) {
      localStorage.setItem('rigfreaks-has-custom-components', hasCustomComponents);
    }
  } catch (error) {
    console.error('Error loading theme:', error);
  }
};

// Reset theme to default by removing stored theme and applying default styles
export const resetThemeToDefault = (): void => {
  try {
    // Backup component data before resetting theme, to ensure we don't lose data
    const componentData = localStorage.getItem('rigfreaks-components');
    const componentsBackup = localStorage.getItem('rigfreaks-components-backup');
    const componentTimestamp = localStorage.getItem('rigfreaks-components-timestamp');
    const hasCustomComponents = localStorage.getItem('rigfreaks-has-custom-components');
    
    // Remove theme only
    localStorage.removeItem('rigfreaks-theme');
    
    // Reset CSS variables to their default values without page reload
    document.documentElement.style.removeProperty('--background');
    document.documentElement.style.removeProperty('--foreground');
    document.documentElement.style.removeProperty('--muted');
    document.documentElement.style.removeProperty('--muted-foreground');
    document.documentElement.style.removeProperty('--popover');
    document.documentElement.style.removeProperty('--popover-foreground');
    document.documentElement.style.removeProperty('--card');
    document.documentElement.style.removeProperty('--card-foreground');
    document.documentElement.style.removeProperty('--border');
    document.documentElement.style.removeProperty('--input');
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--primary-foreground');
    document.documentElement.style.removeProperty('--secondary');
    document.documentElement.style.removeProperty('--secondary-foreground');
    document.documentElement.style.removeProperty('--accent');
    document.documentElement.style.removeProperty('--accent-foreground');
    document.documentElement.style.removeProperty('--destructive');
    document.documentElement.style.removeProperty('--destructive-foreground');
    document.documentElement.style.removeProperty('--ring');
    document.documentElement.style.removeProperty('--dark-base');
    document.documentElement.style.removeProperty('--dark-surface');
    document.documentElement.style.removeProperty('--dark-card');
    document.documentElement.style.removeProperty('--chart-1');
    document.documentElement.style.removeProperty('--chart-2');
    document.documentElement.style.removeProperty('--chart-3');
    document.documentElement.style.removeProperty('--chart-4');
    document.documentElement.style.removeProperty('--chart-5');
    
    // Restore component data after theme reset
    if (componentData) {
      localStorage.setItem('rigfreaks-components', componentData);
    }
    
    if (componentsBackup) {
      localStorage.setItem('rigfreaks-components-backup', componentsBackup);
    }
    
    if (componentTimestamp) {
      localStorage.setItem('rigfreaks-components-timestamp', componentTimestamp);
    }
    
    if (hasCustomComponents) {
      localStorage.setItem('rigfreaks-has-custom-components', hasCustomComponents);
    }
    
    console.log('Theme reset to default without page reload, component data preserved');
  } catch (error) {
    console.error('Error resetting theme:', error);
  }
};

// Get current theme data
export const getCurrentTheme = (): Record<string, string> => {
  const theme: Record<string, string> = {};
  
  // List of CSS variables to extract
  const variables = [
    '--background',
    '--foreground',
    '--dark-base',
    '--dark-surface',
    '--dark-card',
    '--card',
    '--popover',
    '--primary',
    '--secondary',
    '--muted',
    '--accent',
    '--destructive',
    '--border',
    '--input',
    '--ring',
    '--chart-1',
    '--chart-2',
    '--chart-3',
    '--chart-4',
    '--chart-5',
  ];
  
  // Extract current computed values
  variables.forEach(variable => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    if (value) {
      theme[variable] = value;
    }
  });
  
  return theme;
};

// Export theme as JSON string
export const exportThemeAsJson = (): string => {
  const theme = getCurrentTheme();
  return JSON.stringify(theme, null, 2);
};

// Import and apply theme from JSON string
export const importThemeFromJson = (jsonString: string): boolean => {
  try {
    // Backup component data before importing theme
    const componentData = localStorage.getItem('rigfreaks-components');
    const componentsBackup = localStorage.getItem('rigfreaks-components-backup');
    const componentTimestamp = localStorage.getItem('rigfreaks-components-timestamp');
    const hasCustomComponents = localStorage.getItem('rigfreaks-has-custom-components');
    
    const theme = JSON.parse(jsonString);
    
    // Apply theme
    Object.keys(theme).forEach(variable => {
      document.documentElement.style.setProperty(variable, theme[variable]);
    });
    
    // Save to localStorage
    localStorage.setItem('rigfreaks-theme', jsonString);
    
    // Restore component data after theme import
    if (componentData) {
      localStorage.setItem('rigfreaks-components', componentData);
    }
    
    if (componentsBackup) {
      localStorage.setItem('rigfreaks-components-backup', componentsBackup);
    }
    
    if (componentTimestamp) {
      localStorage.setItem('rigfreaks-components-timestamp', componentTimestamp);
    }
    
    if (hasCustomComponents) {
      localStorage.setItem('rigfreaks-has-custom-components', hasCustomComponents);
    }
    
    return true;
  } catch (error) {
    console.error('Error importing theme:', error);
    return false;
  }
};