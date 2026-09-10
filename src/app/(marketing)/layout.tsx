export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-[100dvh] bg-zinc-950 text-white">
      {children}
    </div>
  );
}
