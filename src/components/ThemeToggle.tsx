import {
  useEffect,
  useState
} from 'react';
import {
  Sun,
  Moon
} from 'lucide-react';
import { Button } from './ui/button';

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) ?? "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Apply theme globally
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      let actual: "light" | "dark";
      if (theme === "system") {
        actual = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        actual = theme;
      }
      setResolvedTheme(actual);
      root.classList.remove("light", "dark");
      root.classList.add(actual);
    };

    applyTheme();

    // Listen for system changes if using system mode
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (theme === "system") applyTheme();
    };
    mq.addEventListener("change", listener);

    return () => mq.removeEventListener("change", listener);
  }, [theme]);

  // Persist user selection
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-transparent backdrop-blur-sm border-slate-200 dark:border-slate-800 relative"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun
        className={`h-5 w-5 transition-all ${
          resolvedTheme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${
          resolvedTheme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

