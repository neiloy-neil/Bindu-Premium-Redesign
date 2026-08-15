import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "radial-gradient(circle at center, #001618 0%, #0A0A0A 65%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 124,
            height: 19,
            background: "#00E5FF",
            borderRadius: 10,
            transform: "rotate(45deg)",
            boxShadow: "0 0 22px #00E5FF, 0 0 44px #00E5FF66",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 124,
            height: 19,
            background: "#00E5FF",
            borderRadius: 10,
            transform: "rotate(-45deg)",
            boxShadow: "0 0 22px #00E5FF, 0 0 44px #00E5FF66",
          }}
        />
      </div>
    ),
    { width: 180, height: 180 }
  )
}
