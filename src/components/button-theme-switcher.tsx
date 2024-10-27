"use client";

import { Loader2, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "./ui/button";

const icons: {
  [key: string]: ReactNode;
} = {
  light: <SunIcon />,
  dark: <MoonIcon />,
  system: <SunMoonIcon />,
};

export default function ButtonThemeSwitcher() {
  const { setTheme, themes, theme } = useTheme();

  const [currentTheme, setCurrentTheme] = useState<string>();
  useEffect(() => {
    if (theme) setCurrentTheme(theme);
  }, [theme]);

  return (
    <>
      <Button
        size={"icon"}
        variant={"outline"}
        onClick={() => {
          if (currentTheme) {
            const index = themes.indexOf(currentTheme);
            const nextIndex = (index + 1) % themes.length;
            setTheme(themes[nextIndex]);
          }
        }}
      >
        {currentTheme !== undefined ? (
          icons[currentTheme]
        ) : (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
      </Button>
    </>
  );
}
