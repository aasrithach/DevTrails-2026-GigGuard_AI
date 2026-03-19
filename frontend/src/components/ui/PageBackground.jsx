import React from 'react';

const PageBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020817]">
      {/* 1. Gradient Mesh */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(129, 140, 248, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.8) 0%, transparent 100%)
          `
        }}
      />

      {/* 2. Floating Orbs */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-float"
        style={{
          top: '-10%',
          left: '-10%',
          background: 'radial-gradient(circle, #14B8A6 0%, transparent 70%)',
          animationDuration: '10s'
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 animate-float"
        style={{
          bottom: '10%',
          right: '5%',
          background: 'radial-gradient(circle, #818CF8 0%, transparent 70%)',
          animationDuration: '15s',
          animationDelay: '-2s'
        }}
      />

      {/* 3. Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 4. Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

export default PageBackground;
