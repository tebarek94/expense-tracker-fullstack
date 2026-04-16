import { useThemeSettings } from "../../hooks/useThemeSettings";
import { Select } from "../ui/Select";

export const ThemeCustomizer = () => {
  const { settings, setMode, setPrimary, setSecondary, setFont } = useThemeSettings();

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Select
        label="Theme"
        value={settings.mode}
        onChange={(event) => setMode(event.target.value as "light" | "dark")}
        options={[
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" }
        ]}
      />
      <Select
        label="Primary"
        value={settings.primary}
        onChange={(event) =>
          setPrimary(event.target.value as "indigo" | "blue" | "emerald" | "violet")
        }
        options={[
          { label: "Indigo", value: "indigo" },
          { label: "Blue", value: "blue" },
          { label: "Emerald", value: "emerald" },
          { label: "Violet", value: "violet" }
        ]}
      />
      <Select
        label="Secondary"
        value={settings.secondary}
        onChange={(event) =>
          setSecondary(event.target.value as "indigo" | "blue" | "emerald" | "violet")
        }
        options={[
          { label: "Emerald", value: "emerald" },
          { label: "Blue", value: "blue" },
          { label: "Indigo", value: "indigo" },
          { label: "Violet", value: "violet" }
        ]}
      />
      <Select
        label="Typography"
        value={settings.font}
        onChange={(event) => setFont(event.target.value as "inter" | "poppins" | "system")}
        options={[
          { label: "Inter", value: "inter" },
          { label: "Poppins", value: "poppins" },
          { label: "System", value: "system" }
        ]}
      />
    </div>
  );
};
