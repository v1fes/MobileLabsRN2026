import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from '../theme';

const ThemeToggleContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const toggleTheme = () => setIsDark((p) => !p);
  const theme = isDark ? darkTheme : lightTheme;

  const ctx = useMemo(() => ({ isDark, toggleTheme }), [isDark]);

  return (
    <ThemeToggleContext.Provider value={ctx}>
      <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
    </ThemeToggleContext.Provider>
  );
}

export function useThemeToggle() {
  return useContext(ThemeToggleContext);
}
