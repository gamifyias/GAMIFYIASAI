export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle gradient orbs */}
      <div 
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(175 45% 45% / 0.04) 0%, transparent 70%)",
        }}
      />
      <div 
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(38 55% 50% / 0.03) 0%, transparent 70%)",
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, hsl(220 20% 4% / 0.4) 100%)",
        }}
      />
    </div>
  );
}
