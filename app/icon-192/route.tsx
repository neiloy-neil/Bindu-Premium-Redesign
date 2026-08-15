import { ImageResponse } from "next/og"

export const runtime = "edge"

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "radial-gradient(circle at center, #001618 0%, #0A0A0A 65%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Top-left → bottom-right stroke */}
        <div
          style={{
            position: "absolute",
            width: 132,
            height: 20,
            background: "#00E5FF",
            borderRadius: 10,
            transform: "rotate(45deg)",
            boxShadow: "0 0 24px #00E5FF, 0 0 48px #00E5FF66",
          }}
        />
        {/* Top-right → bottom-left stroke */}
        <div
          style={{
            position: "absolute",
            width: 132,
            height: 20,
            background: "#00E5FF",
            borderRadius: 10,
            transform: "rotate(-45deg)",
            boxShadow: "0 0 24px #00E5FF, 0 0 48px #00E5FF66",
          }}
        />
      </div>
    ),
    { width: 192, height: 192 }
  )
}
