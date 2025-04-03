import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
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
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#0052FF', marginBottom: '12px' }}>
            Color Match
          </h1>
          <div style={{ width: '80%', height: '2px', backgroundColor: '#eaeaea', margin: '20px 0' }} />
          <p style={{ fontSize: '24px', color: '#333333', marginBottom: '30px', lineHeight: '1.4' }}>
            Match the colored tiles to the target color!
          </p>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
            {['#FF5252', '#FFB74D', '#0052FF', '#64DD17'].map((color, i) => (
              <div
                key={i}
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: color,
                  borderRadius: '8px',
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: '20px',
              color: '#333333',
              backgroundColor: '#f0f0f0',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '20px',
            }}
          >
            +10 points for correct matches • -5 points for wrong matches
          </div>
          <div
            style={{
              backgroundColor: '#0052FF',
              color: 'white',
              fontSize: '24px',
              marginTop: '40px',
              paddingTop: '12px',
              paddingBottom: '12px',
              paddingLeft: '24px',
              paddingRight: '24px',
              borderRadius: '12px',
              fontWeight: 'bold',
            }}
          >
            Click to Start Game
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