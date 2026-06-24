import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SaaSPro — All-in-One Business Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Geist",
          color: "white",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, marginBottom: 24 }}>
          SaaSPro
        </div>
        <div style={{ fontSize: 32, opacity: 0.9, textAlign: "center", maxWidth: 800 }}>
          Manage clients, automate workflows, track analytics, and grow your business — all in one place.
        </div>
      </div>
    ),
    { ...size }
  );
}