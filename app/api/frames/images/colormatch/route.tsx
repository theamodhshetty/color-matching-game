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
          backgroundColor: '#F5F5F5',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            height: '90%',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#0052FF', marginBottom: '12px' }}>
            Color Match
          </h1>
          
          <div style={{ display: 'flex', gap: '12px', margin: '20px 0' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#FF5252', borderRadius: '8px' }} />
            <div style={{ width: '60px', height: '60px', backgroundColor: '#FFB74D', borderRadius: '8px' }} />
            <div style={{ width: '60px', height: '60px', backgroundColor: '#0052FF', borderRadius: '8px' }} />
            <div style={{ width: '60px', height: '60px', backgroundColor: '#64DD17', borderRadius: '8px' }} />
          </div>
          
          <div
            style={{
              fontSize: '24px',
              color: '#333333',
              textAlign: 'center',
              margin: '20px 0',
            }}
          >
            Match tiles to target colors!
          </div>
        </div>
      </div>
    ),
    {
      width: 400,
      height: 400,
    }
  );
} 