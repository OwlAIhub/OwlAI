import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)',
          borderRadius: '24px',
        }}
      >
        <div
          style={{
            fontSize: '120px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          🦉
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
