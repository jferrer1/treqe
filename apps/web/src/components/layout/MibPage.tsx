interface Props { page: string; }

export function MibPage({ page }: Props) {
  return (
    <iframe
      src={`/mib/${page}.html`}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100dvh",
        border: "none", background: "#F9F7F2",
      }}
      title={page}
    />
  );
}
