import { useThemeStore, applyThemePreference, type ThemePreference } from "@/stores/useThemeStore";
import { Select } from "@/Components/ui";

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

export function ThemeToggle() {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  function handleChange(next: ThemePreference) {
    setPreference(next);
    applyThemePreference(next);
  }

  return (
    <Select
      aria-label="Theme preference"
      value={preference}
      onChange={(e) => handleChange(e.target.value as ThemePreference)}
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}
