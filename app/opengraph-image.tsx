import { ImageResponse } from "next/og";

export const alt =
  "FlowCrew turns messy client messages into structured leads and next actions";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 50% 0%, rgba(200,245,66,0.2), transparent 48%), #080808",
          color: "#f0ede8",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            gap: 16,
            marginBottom: 44,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "#c8f542",
              borderRadius: 14,
              color: "#080808",
              display: "flex",
              height: 58,
              justifyContent: "center",
              width: 58,
            }}
          >
            F
          </div>
          FlowCrew
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: "-3px",
            lineHeight: 1.02,
            maxWidth: 980,
          }}
        >
          Turn messy client messages into structured leads.
        </div>
        <div
          style={{
            color: "rgba(240,237,232,0.62)",
            display: "flex",
            fontSize: 28,
            lineHeight: 1.4,
            marginTop: 32,
            maxWidth: 900,
          }}
        >
          AI client intake for freelancers, agencies, consultants, and service
          providers.
        </div>
      </div>
    ),
    size,
  );
}
