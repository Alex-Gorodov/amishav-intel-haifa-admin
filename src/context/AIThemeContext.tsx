import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AIThemeContextType {
  isAI: boolean;
  isDesktop: boolean;
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

  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth > 600
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      AI_THEME_STORAGE_KEY,
      String(isAI)
    );
  }, [isAI]);

  return (
    <AIThemeContext.Provider
      value={{
        isDesktop,
        isAI: isDesktop ? isAI : false,
        setIsAI,
      }}
    >
      {children}
    </AIThemeContext.Provider>
  );
}
