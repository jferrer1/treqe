import { Link } from "react-router-dom";

export function Header() {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        minHeight: 64,
        background: "rgba(248,246,240,0.35)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "#141414", letterSpacing: "-0.5px" }}>
          Treqe
        </span>
      </Link>
      <Link
        to="/blog"
        style={{
          padding: "6px 14px",
          borderRadius: 20,
          background: "#141414",
          color: "#FAFAF8",
          fontSize: "0.8rem",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        Blog
      </Link>
    </header>
  );
}
