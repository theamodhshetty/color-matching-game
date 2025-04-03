export const dynamic = 'force-dynamic';

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL || "https://color-matching-game.vercel.app";

  const data = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
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

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
