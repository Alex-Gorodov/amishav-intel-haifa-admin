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

const AIThemeContext = createContext<AIThemeContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
}

export function AIThemeProvider({ children }: ProviderProps) {
  const [isAI, setIsAI] = useState(false);

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

  return (
    <AIThemeContext.Provider value={{ isDesktop, isAI, setIsAI }}>
      {children}
    </AIThemeContext.Provider>
  );
}

export function useAITheme() {
  const context = useContext(AIThemeContext);

  if (!context) {
    throw new Error(
      "useAITheme must be used inside AIThemeProvider"
    );
  }

  return context;
}
