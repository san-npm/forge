import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'OpenLetz — Simulateur aides Luxembourg'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 20,
            background: 'rgba(16, 185, 129, 0.15)',
            marginBottom: 24,
          }}
        >
          <svg width="48" height="48" viewBox="0 0 69 69" fill="none">
            <path d="M20.8516 0.597656L26.852 6.29803C29.1021 8.39817 30.3022 11.2484 30.3022 14.3986C30.3022 17.3988 31.5023 20.249 33.6024 22.3491L34.3525 23.0992L41.253 0.747653" fill="white"/>
            <path d="M0.445312 20.551L8.69587 20.251C11.6961 20.101 14.6963 21.3011 16.7964 23.4012C18.8966 25.5013 21.7468 26.5514 24.747 26.5514H25.797L14.6963 6" fill="white"/>
            <path d="M0.450035 49.0522L6.00041 43.0518C8.10055 40.8016 10.9507 39.4515 13.951 39.4515C16.9512 39.4515 19.6513 38.1014 21.7515 36.0013L22.5015 35.2512L0 28.8008" fill="white"/>
            <path d="M20.851 68.8533L20.401 60.6027C20.251 57.6025 21.3011 54.6023 23.4012 52.3522C25.3513 50.252 26.5514 47.2518 26.4014 44.4016V43.3516L6 54.9023" fill="white"/>
            <path d="M49.3529 68.253L43.2025 62.8527C40.9524 60.9026 39.6023 58.0524 39.4523 54.9021C39.3023 51.9019 37.9522 49.2018 35.852 47.1016L35.102 46.3516L29.1016 69.0031" fill="white"/>
            <path d="M68.847 47.4036L60.5965 48.0036C57.5963 48.3036 54.5961 47.2536 52.3459 45.1534C50.0958 43.2033 47.2456 42.1532 44.2454 42.3032H43.1953L55.1961 62.4046" fill="white"/>
            <path d="M67.4968 19.0508L62.2464 25.3512C60.2963 27.6014 57.4461 29.1015 54.4459 29.2515C51.4457 29.4015 48.7455 30.7516 46.7953 33.0017L46.1953 33.7518L68.9969 39.1522" fill="white"/>
            <path d="M46.3539 0L47.1039 8.25056C47.4039 11.2508 46.5039 14.251 44.4038 16.6511C42.4536 18.9013 41.5536 21.7515 41.7036 24.7517L41.8536 25.8018L61.6549 13.3509" fill="white"/>
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: 'white',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          OpenLetz
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          Simulateur d&apos;aides digitalisation &amp; IA
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 32,
            padding: '12px 24px',
            borderRadius: 999,
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <span style={{ fontSize: 20 }}>🇱🇺</span>
          <span style={{ fontSize: 18, color: '#6ee7b7', fontWeight: 600 }}>
            Luxembourg &amp; Grande R&eacute;gion
          </span>
        </div>

        {/* Programs */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 32,
          }}
        >
          {['SME Digital', 'SME AI', 'Fit 4 Digital', 'Fit 4 AI'].map((name) => (
            <div
              key={name}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
