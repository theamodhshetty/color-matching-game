export const dynamic = 'force-dynamic';

// Define the data structure type
type FarcasterData = {
  frame: {
    version: string;
    name: string;
    iconUrl: string;
    homeUrl: string | undefined;
    imageUrl: string;
    buttonTitle: string;
    splashImageUrl: string;
    splashBackgroundColor: string;
    webhookUrl: string;
  };
  accountAssociation?: {
    header: string;
    payload: string;
    signature: string;
  };
};

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || "https://color-matching-game.vercel.app";

  // Initialize with frame data
  const data: FarcasterData = {
    frame: {
      version: "vNext",
      name: "Color Match Game",
      iconUrl: `${URL}/api/frames/images/colormatch`,
      homeUrl: URL,
      imageUrl: `${URL}/api/frames/images/intro`,
      buttonTitle: "Play Color Match",
      splashImageUrl: `${URL}/api/frames/images/colormatch`,
      splashBackgroundColor: "#F5F5F5",
      webhookUrl: `${URL}/api/frames`,
    },
  };

  // Only include account association data if all values are provided
  if (process.env.FARCASTER_HEADER && 
      process.env.FARCASTER_PAYLOAD && 
      process.env.FARCASTER_SIGNATURE) {
    data.accountAssociation = {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    };
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
