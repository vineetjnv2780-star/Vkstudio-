import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Total duration sequence
    // 0s: Mount
    // 2.5s: Start fade out
    // 3.5s: Unmount callback
    
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onFinish, 1000); // Allow 1s for the fade-out transition
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ease-in-out ${exiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full">
        {/* Geometric Shards (CSS simulated) */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-gradient-to-br from-zinc-900/40 to-transparent rotate-45 transform origin-bottom-right backdrop-blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-gradient-to-tl from-zinc-900/30 to-transparent -rotate-12 transform origin-top-left" />
        
        {/* Blue Glow Spot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full animate-pulse-slow" />
        
        {/* Light Beam */}
        <div className="absolute top-0 right-0 w-[2px] h-[60%] bg-gradient-to-b from-blue-500/0 via-blue-400/20 to-blue-500/0 rotate-45 transform origin-top translate-x-32" />
        <div className="absolute top-0 left-20 w-[1px] h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo Container with animations */}
        <div className={`flex flex-col items-center transform transition-transform duration-1000 ${exiting ? 'scale-110' : 'scale-100'}`}>
          
          {/* VK Text */}
          <h1 className="font-serif text-8xl md:text-9xl tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-50 to-slate-400 drop-shadow-[0_0_35px_rgba(59,130,246,0.5)] animate-fade-in-up">
            VK
          </h1>
          
          {/* Studio Text */}
          <span className="font-serif text-5xl md:text-6xl text-blue-50 tracking-wide -mt-2 md:-mt-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] animate-fade-in-up delay-200">
            studio
          </span>

        </div>

        {/* Footer Text */}
        <div className="absolute top-[300px] md:top-[350px] opacity-0 animate-fade-in delay-700">
             {/* Decorative Line */}
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto mb-4" />
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-12 z-10 animate-slide-up-fade delay-500">
        <p className="text-[10px] md:text-xs text-blue-200/80 tracking-[0.4em] font-light uppercase border-t border-blue-500/20 pt-4 px-12">
          Creative Mobile Solutions
        </p>
      </div>

      {/* Custom Keyframes for this component */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade {
          animation: slide-up-fade 0.8s ease-out forwards;
          opacity: 0; /* Start hidden */
        }
      `}</style>
    </div>
  );
};