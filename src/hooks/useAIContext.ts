import { useContext } from "react";
import { AIThemeContext } from "../context/AIThemeContext";

export function useAITheme() {
  const context = useContext(AIThemeContext);

  if (!context) {
    throw new Error(
      "useAITheme must be used inside AIThemeProvider"
    );
  }

  return context;
}
