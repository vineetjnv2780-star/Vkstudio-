import React, { useState, useEffect, useRef } from 'react';
import { Power, Zap, AlertCircle } from './Icons';

export const Flashlight: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    return () => { stopTorch(); };
  }, []);

  const stopTorch = async () => {
    if (trackRef.current) {
      try {
        await trackRef.current.applyConstraints({ advanced: [{ torch: false } as any] });
      } catch (e) {}
      trackRef.current.stop();
      trackRef.current = null;
    }
  };

  const toggleFlashlight = async () => {
    if (isToggling) return;
    setIsToggling(true);
    setError(null);

    try {
      if (isOn) {
        await stopTorch();
        setIsOn(false);
      } else {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: 'environment' },
            });
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities() as any;
            const settings = track.getSettings() as any;
            const supportsTorch = !!capabilities.torch || ('torch' in settings);

            if (supportsTorch) {
               await track.applyConstraints({ advanced: [{ torch: true } as any] });
              trackRef.current = track;
              setHasTorch(true);
            } else {
               track.stop();
               setHasTorch(false);
            }
            setIsOn(true);
          } catch (err) {
            setHasTorch(false);
            setIsOn(true);
          }
        } else {
          setHasTorch(false);
          setIsOn(true);
        }
      }
    } catch (err) {
      setIsOn(false);
      stopTorch(); 
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className={`relative h-full flex flex-col items-center justify-center transition-all duration-700 ${isOn && !hasTorch ? 'bg-white' : 'bg-transparent'}`}>
      
      {/* Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[120px] transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />

      {/* Main Control */}
      <button
        onClick={toggleFlashlight}
        disabled={isToggling}
        className={`relative z-10 w-56 h-56 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl group ${
          isOn 
            ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_80px_rgba(59,130,246,0.6)] scale-105' 
            : 'bg-[#18181b] shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)] border-8 border-[#27272a]'
        } ${isToggling ? 'opacity-90 cursor-wait' : 'cursor-pointer active:scale-95'}`}
      >
        <div className={`absolute inset-0 rounded-full border border-white/10 ${isOn ? 'opacity-50' : 'opacity-0'}`} />
        <Power 
          size={80} 
          className={`transition-all duration-500 ${isOn ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-zinc-600 group-hover:text-zinc-500'}`} 
        />
      </button>

      {/* Indicator */}
      <div className="mt-16 text-center relative z-10 space-y-2">
        <div className={`text-4xl font-bold tracking-[0.2em] transition-colors duration-300 ${isOn && !hasTorch ? 'text-black' : 'text-white'}`}>
          {isOn ? 'ACTIVE' : 'READY'}
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${isOn && !hasTorch ? 'border-gray-300 text-gray-500' : 'border-white/10 text-gray-400 bg-white/5'} text-xs font-medium uppercase tracking-wider`}>
           {hasTorch ? <Zap size={12} /> : <AlertCircle size={12} />}
           <span>{hasTorch ? 'Torch Mode' : 'Screen Mode'}</span>
        </div>
      </div>
    </div>
  );
};