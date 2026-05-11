import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AIThemeContextType {
  isAI: boolean;
  isMobile: boolean;
  setIsAI: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AIThemeContext = createContext<AIThemeContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

const AI_THEME_STORAGE_KEY = "is-ai-theme-enabled";

export function AIThemeProvider({ children }: ProviderProps) {
  const [isAI, setIsAI] = useState<boolean>(() => {
    const savedValue = localStorage.getItem(
      AI_THEME_STORAGE_KEY
    );

    return savedValue === "true";
  });

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 620
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 620);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    localStorage.setItem(
      AI_THEME_STORAGE_KEY,
      String(isAI)
    );
  }, [isAI]);

  return (
    <AIThemeContext.Provider
      value={{
        isMobile,
        isAI: isAI,
        setIsAI,
      }}
    >
      {children}
    </AIThemeContext.Provider>
  );
}
