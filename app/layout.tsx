import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL;
  return {
    title: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
    description:
      "Color Match Game - A fast-paced mini game where you match tiles with target colors",
    other: {
      // Frame metadata for Farcaster
      "fc:frame": JSON.stringify({
        version: process.env.NEXT_PUBLIC_VERSION,
        image: {
          src: `${URL}/api/frames/images/intro`,
          aspectRatio: "1:1",
        },
        buttons: [
          {
            label: "Start Color Match",
          },
        ],
        postUrl: `${URL}/api/frames`,
      }),
      // Original frame data for OnchainKit
      "fc:frame:image": `${URL}/api/frames/images/intro`,
      "fc:frame:post_url": `${URL}/api/frames`,
      "fc:frame:button:1": "Start Color Match",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background overflow-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
