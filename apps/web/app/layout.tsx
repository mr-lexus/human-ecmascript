import "@mantine/core/styles.css";
import "./styles.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://mr-lexus.github.io/human-ecmascript/"),
  title: { default: "Human ECMAScript", template: "%s · Human ECMAScript" },
  description: "A bilingual, evidence-backed field guide to ECMA-262.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
