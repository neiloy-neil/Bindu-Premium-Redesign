import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#0A1128",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            background: "#E24A00",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
