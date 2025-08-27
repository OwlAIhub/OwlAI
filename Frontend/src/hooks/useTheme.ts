import { useState, useEffect } from "react";
import { storage } from "@/utils";
import { STORAGE_KEYS } from "@/constants";

interface UseThemeReturn {
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  toggleDarkMode: () => void;
}

export const useTheme = (): UseThemeReturn => {
  const [darkMode, setDarkModeState] = useState(() => {
    const savedMode = storage.get<boolean>(STORAGE_KEYS.DARK_MODE);
    return savedMode !== null ? savedMode : true; // Default to dark mode
  });

  // Apply dark mode to document and save to storage
  const setDarkMode = (mode: boolean) => {
    setDarkModeState(mode);

    if (mode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    storage.set(STORAGE_KEYS.DARK_MODE, mode);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Apply initial dark mode on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return {
    darkMode,
    setDarkMode,
    toggleDarkMode,
  };
};
