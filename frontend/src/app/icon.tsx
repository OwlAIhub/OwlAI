import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            color: "white",
            fontWeight: "bold",
          }}
        >
          🦉
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
