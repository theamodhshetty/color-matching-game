import { NextRequest } from "next/server";

// We'll use a different approach since the Frame API might not be fully supported in onchainkit yet
type FrameRequest = {
  untrustedData: {
    buttonIndex?: number;
  };
  trustedData?: {
    messageBytes?: string;
  };
  state?: {
    serialized?: Record<string, unknown>;
  };
};

// Define our frame state type
interface GameState {
  gameState: string;
  targetColor?: string;
  score?: number;
}

export async function POST(req: NextRequest) {
  const body: FrameRequest = await req.json();
  
  // Extract button clicked and state data
  const buttonIndex = body.untrustedData?.buttonIndex || 0;
  // Safely handle the state data
  const serializedState = body.state?.serialized || {};
  
  // Parse the state with proper type handling
  const frameData: GameState = {
    gameState: typeof serializedState.gameState === 'string' ? serializedState.gameState : 'intro',
    targetColor: typeof serializedState.targetColor === 'string' ? serializedState.targetColor : undefined,
    score: typeof serializedState.score === 'number' ? serializedState.score : undefined
  };
  
  // Handle different game states
  let gameState: string = frameData.gameState;
  let score: number = typeof frameData.score === 'number' ? frameData.score : 0;
  let targetColor: string = typeof frameData.targetColor === 'string' ? frameData.targetColor : '';
  const selectedTile = buttonIndex ? buttonIndex - 1 : -1;
  
  // Handle state transitions
  switch (gameState) {
    case 'intro':
      // Start the game
      if (buttonIndex === 1) {
        gameState = 'playing';
        targetColor = generateRandomColor();
        score = 0;
      }
      break;
    
    case 'playing':
      // Handle tile selection
      if (selectedTile >= 0 && selectedTile < 4) {
        const tileColors = generateTileColors(targetColor);
        
        // Check if selected correct tile
        if (tileColors[selectedTile] === targetColor) {
          score += 10;
          
          // Generate new round or end game
          if (score >= 50) {
            gameState = 'end';
          } else {
            targetColor = generateRandomColor();
          }
        } else {
          score = Math.max(0, score - 5);
        }
      }
      break;
    
    case 'end':
      // Restart game
      if (buttonIndex === 1) {
        gameState = 'playing';
        targetColor = generateRandomColor();
        score = 0;
      }
      break;
  }
  
  // Generate the appropriate frame HTML response
  let frameHtml = '';
  
  switch (gameState) {
    case 'intro':
      frameHtml = generateFrameHtml({
        buttons: ['Start Game'],
        image: `${process.env.NEXT_PUBLIC_URL}/api/frames/images/intro`,
        state: { gameState: 'intro' }
      });
      break;
    
    case 'playing':
      frameHtml = generateFrameHtml({
        buttons: ['1', '2', '3', '4'],
        image: `${process.env.NEXT_PUBLIC_URL}/api/frames/images/game?color=${encodeURIComponent(targetColor)}&score=${score}`,
        state: { gameState: 'playing', targetColor, score }
      });
      break;
    
    case 'end':
      frameHtml = generateFrameHtml({
        buttons: ['Play Again'],
        image: `${process.env.NEXT_PUBLIC_URL}/api/frames/images/end?score=${score}`,
        state: { gameState: 'end', score }
      });
      break;
  }
  
  return new Response(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

// Helper functions

// Generate HTML for a Frame
function generateFrameHtml({ 
  buttons = [], 
  image = '', 
  state = {}
}: { 
  buttons: string[], 
  image: string, 
  state: Record<string, unknown> 
}) {
  const postUrl = `${process.env.NEXT_PUBLIC_URL}/api/frames`;
  
  // Create button HTML
  const buttonHtml = buttons.map((label, i) => 
    `<meta property="fc:frame:button:${i+1}" content="${label}" />`
  ).join('\n');
  
  // Base HTML with metadata
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${image}" />
        <meta property="fc:frame:post_url" content="${postUrl}" />
        ${buttonHtml}
        <meta property="fc:frame:state" content="${Buffer.from(JSON.stringify(state)).toString('base64')}" />
      </head>
      <body>
        <h1>Color Match Game</h1>
        <p>This is a Farcaster Frame. Open it in a compatible client.</p>
      </body>
    </html>
  `;
}

// Generate a random color
function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

// Generate 4 tile colors with at least one matching the target
function generateTileColors(targetColor: string) {
  const colors = Array(4).fill('').map(() => generateRandomColor());
  const randomIndex = Math.floor(Math.random() * 4);
  colors[randomIndex] = targetColor;
  return colors;
}

// For Frames GET request
export async function GET() {
  // Initial frame for when someone first discovers this page
  const frameHtml = generateFrameHtml({
    buttons: ['Start Color Match Game'],
    image: `${process.env.NEXT_PUBLIC_URL}/api/frames/images/intro`,
    state: { gameState: 'intro' }
  });
  
  return new Response(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 