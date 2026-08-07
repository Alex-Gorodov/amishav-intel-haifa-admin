import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface DarkThemeContextType {
  isMobile: boolean;
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DarkThemeContext = createContext<DarkThemeContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

const DARK_THEME_STORAGE_KEY = "is-dark-theme-enabled";

export function DarkThemeProvider({ children }: ProviderProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const savedValue = localStorage.getItem(
      DARK_THEME_STORAGE_KEY
    );

    return savedValue === "true";
  });

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    localStorage.setItem(
      DARK_THEME_STORAGE_KEY,
      String(isDark)
    );
  }, [isDark]);

  return (
    <DarkThemeContext.Provider
      value={{
        isMobile,
        isDark: isDark,
        setIsDark,
      }}
    >
      {children}
    </DarkThemeContext.Provider>
  );
}
