"use client";

import { createTheme, MantineProvider } from "@mantine/core";

const theme = createTheme({
  primaryColor: "indigo",
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  headings: { fontFamily: "Georgia, Cambria, Times New Roman, serif", fontWeight: "500" },
  defaultRadius: "md",
});

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>;
}
