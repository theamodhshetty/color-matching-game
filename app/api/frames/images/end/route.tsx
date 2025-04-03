import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const score = parseInt(searchParams.get('score') || '0');
  
  // Define dynamic messages based on score
  let message = "You did it!";
  if (score >= 100) {
    message = "Amazing score!";
  } else if (score >= 50) {
    message = "Great job!";
  } else if (score >= 30) {
    message = "Well done!";
  } else {
    message = "Keep practicing!";
  }
  
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
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#0052FF', marginBottom: '20px' }}>
            Game Over!
          </h1>
          
          <div style={{ width: '80%', height: '2px', backgroundColor: '#eaeaea', margin: '20px 0' }} />
          
          <h2 style={{ fontSize: '32px', color: '#333333', marginBottom: '10px' }}>
            {message}
          </h2>
          
          <div style={{ 
            fontSize: '80px', 
            fontWeight: 'bold',
            color: '#FF5252',
            margin: '30px 0',
          }}>
            {score}
          </div>
          
          <div style={{ 
            fontSize: '24px',
            color: '#333',
            marginBottom: '30px',
          }}>
            Final Score
          </div>
          
          <div
            style={{
              backgroundColor: '#0052FF',
              color: 'white',
              fontSize: '24px',
              marginTop: '20px',
              paddingTop: '12px',
              paddingBottom: '12px',
              paddingLeft: '24px',
              paddingRight: '24px',
              borderRadius: '12px',
              fontWeight: 'bold',
            }}
          >
            Play Again
          </div>
          
          <div style={{ 
            marginTop: '40px',
            fontSize: '16px',
            color: '#666',
          }}>
            Built with MiniKit on Base
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