import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

type ThemeMode = "light" | "dark";
type ColorChoice = "indigo" | "blue" | "emerald" | "violet";
type FontChoice = "inter" | "poppins" | "system";

interface ThemeSettings {
  mode: ThemeMode;
  primary: ColorChoice;
  secondary: ColorChoice;
  font: FontChoice;
}

interface ThemeContextValue {
  settings: ThemeSettings;
  setMode: (mode: ThemeMode) => void;
  setPrimary: (color: ColorChoice) => void;
  setSecondary: (color: ColorChoice) => void;
  setFont: (font: FontChoice) => void;
}

const THEME_KEY = "expense_tracker_theme";

const colorMap: Record<ColorChoice, string> = {
  indigo: "#4f46e5",
  blue: "#2563eb",
  emerald: "#10b981",
  violet: "#7c3aed"
};

const secondaryMap: Record<ColorChoice, string> = {
  indigo: "#818cf8",
  blue: "#38bdf8",
  emerald: "#34d399",
  violet: "#a78bfa"
};

const fontMap: Record<FontChoice, string> = {
  inter: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  poppins: "Poppins, Inter, system-ui, sans-serif",
  system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const defaultTheme: ThemeSettings = {
  mode: "light",
  primary: "indigo",
  secondary: "emerald",
  font: "inter"
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const parseTheme = (): ThemeSettings => {
  const raw = localStorage.getItem(THEME_KEY);
  if (!raw) {
    return defaultTheme;
  }
  try {
    return { ...defaultTheme, ...(JSON.parse(raw) as Partial<ThemeSettings>) };
  } catch {
    return defaultTheme;
  }
};

const applyTheme = (settings: ThemeSettings) => {
  const root = document.documentElement;
  root.classList.toggle("dark", settings.mode === "dark");
  root.style.setProperty("--color-primary", colorMap[settings.primary]);
  root.style.setProperty("--color-secondary", secondaryMap[settings.secondary]);
  root.style.setProperty("--font-family", fontMap[settings.font]);
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultTheme);

  useEffect(() => {
    const initial = parseTheme();
    setSettings(initial);
    applyTheme(initial);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, JSON.stringify(settings));
    applyTheme(settings);
  }, [settings]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      settings,
      setMode: (mode) => setSettings((prev) => ({ ...prev, mode })),
      setPrimary: (primary) => setSettings((prev) => ({ ...prev, primary })),
      setSecondary: (secondary) => setSettings((prev) => ({ ...prev, secondary })),
      setFont: (font) => setSettings((prev) => ({ ...prev, font }))
    }),
    [settings]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
