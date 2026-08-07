import { useContext } from "react";
import { DarkThemeContext } from "../context/DarkThemeContext";

export function useDarkTheme() {
  const context = useContext(DarkThemeContext);

  if (!context) {
    throw new Error(
      "useDarkTheme must be used inside AIThemeProvider"
    );
  }

  return context;
}
