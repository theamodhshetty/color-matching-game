import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetColor = searchParams.get('color') || '#0052FF';
  const score = parseInt(searchParams.get('score') || '0');
  
  const tileColors = generateTileColors(targetColor);
  
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ 
            display: 'flex', 
            width: '100%', 
            justifyContent: 'space-between',
            marginBottom: '30px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Score: {score}
            </div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '20px', marginBottom: '10px' }}>Target Color:</p>
            <div
              style={{
                width: '120px',
                height: '60px',
                backgroundColor: targetColor,
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            margin: '40px 0',
          }}>
            {tileColors.map((color, index) => (
              <div
                key={index}
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: color,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                <div style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold',
                  color: 'white',
                  textShadow: '0 2px 2px rgba(0, 0, 0, 0.5)',
                }}>
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ 
            fontSize: '18px',
            color: '#666',
            backgroundColor: '#f9f9f9',
            padding: '12px',
            borderRadius: '8px',
          }}>
            Select the tile that matches the target color
          </div>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 600,
    }
  );
} 