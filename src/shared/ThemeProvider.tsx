import React, { ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, PaletteMode } from "@mui/material";
import { createStarTrackTheme } from "./Theme";

const themeKeyName = "theme";

type ThemeProviderActions = {
  switchColorMode: () => void;
};

const ThemeProviderContext = React.createContext({} as ThemeProviderActions);

interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = React.useState<PaletteMode>(
    (localStorage.getItem(themeKeyName) as PaletteMode) ?? "light",
  );

  const switchColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem(themeKeyName, newMode);
  };

  const theme = React.useMemo(() => createStarTrackTheme(mode), [mode]);

  return (
    <ThemeProviderContext.Provider value={{ switchColorMode }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeProviderContext.Provider>
  );
}

const useThemeActions = (): ThemeProviderActions => {
  const context = React.useContext(ThemeProviderContext);

  if (!context || Object.keys(context).length === 0) {
    throw new Error("useThemeActions must be used within an ThemeProvider");
  }

  return context;
};

export { ThemeProvider, useThemeActions };
