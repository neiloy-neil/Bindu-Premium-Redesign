import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          fontFamily: "sans-serif",
        }}
      >
        {/* X-mark placeholder until real logo exists */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <line x1="12" y1="12" x2="68" y2="68" stroke="#00E5FF" strokeWidth="8" strokeLinecap="round"/>
            <line x1="68" y1="12" x2="12" y2="68" stroke="#00E5FF" strokeWidth="8" strokeLinecap="round"/>
          </svg>
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}
        >
          BINDU PREMIUM
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#00E5FF",
            letterSpacing: "0.35em",
            marginTop: 24,
            fontWeight: 600,
          }}
        >
          WEAR THE ARC
        </div>

        <div
          style={{
            fontSize: 18,
            color: "#737373",
            marginTop: 20,
            letterSpacing: "0.12em",
          }}
        >
          Bangladesh's original fandom streetwear · Zero bootleg
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
