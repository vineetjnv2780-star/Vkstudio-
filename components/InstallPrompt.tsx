import React, { useState, useEffect } from 'react';
import { X, Share, Smartphone } from './Icons';
import { Button } from './Button';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isStandalone) return;

    // Handler for Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Prevent default mini-infobar
      setDeferredPrompt(e);
      // Slight delay for better UX (don't show immediately on load)
      setTimeout(() => setShow(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation to close popup
    window.addEventListener('appinstalled', () => {
      setShow(false);
      setDeferredPrompt(null);
    });

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (ios) {
      setIsIOS(true);
      // Show for iOS users after a delay if not standalone
      setTimeout(() => setShow(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 flex justify-center pointer-events-none pb-8">
      <div className="w-full max-w-sm bg-[#18181b]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-2xl shadow-black/50 pointer-events-auto animate-in slide-in-from-bottom-full duration-700">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
               <Smartphone className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">Install App</h3>
              <p className="text-sm text-gray-400">Add to home screen</p>
            </div>
          </div>
          <button 
            onClick={() => setShow(false)} 
            className="p-2 -mr-2 -mt-2 rounded-full hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content based on Platform */}
        {isIOS ? (
          <div className="bg-white/5 rounded-2xl p-4 text-sm text-gray-300 space-y-3 border border-white/5">
             <div className="flex items-center gap-3">
               <Share size={20} className="text-blue-500" />
               <span>Tap the <span className="font-bold text-white">Share</span> button in Safari</span>
             </div>
             <div className="w-full h-px bg-white/10" />
             <div className="flex items-center gap-3">
               <div className="w-5 h-5 border-2 border-white/40 rounded-[4px] flex items-center justify-center">
                 <div className="w-2 h-2 bg-white/40 rounded-[1px]" />
               </div>
               <span>Scroll down & select <span className="font-bold text-white">Add to Home Screen</span></span>
             </div>
          </div>
        ) : (
          <Button onClick={handleInstallClick} fullWidth className="shadow-indigo-500/25">
            Install Now
          </Button>
        )}
      </div>
    </div>
  );
};