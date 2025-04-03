import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Read SVG content from public folder
    const svgPath = path.join(process.cwd(), 'public', 'colormatch.svg');
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Render SVG dynamically as PNG
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: '#F5F5F5',
          }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ),
      {
        width: 400,
        height: 400,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Error generating image', { status: 500 });
  }
} 