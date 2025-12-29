import React, { useState, useEffect, useRef } from 'react';
import { Power, Zap, AlertCircle } from 'lucide-react';

export const Flashlight: React.FC = () => {
  const [isOn, setIsOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasTorch, setHasTorch] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopTorch();
    };
  }, []);

  const stopTorch = async () => {
    if (trackRef.current) {
      try {
        // Attempt to turn off torch constraint explicitly before stopping track
        // This helps on some devices where track.stop() doesn't immediately kill the torch driver signal
        await trackRef.current.applyConstraints({
           advanced: [{ torch: false } as any]
        });
      } catch (e) {
        // Ignore constraints error, proceed to stop track
      }
      trackRef.current.stop();
      trackRef.current = null;
    }
  };

  const toggleFlashlight = async () => {
    if (isToggling) return; // Prevent race conditions (double clicks)
    setIsToggling(true);
    setError(null);

    try {
      if (isOn) {
        // Turn Off
        await stopTorch();
        setIsOn(false);
      } else {
        // Turn On
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: 'environment',
              },
            });
            
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities() as any;
            const settings = track.getSettings() as any;

            // Check if torch is supported
            const supportsTorch = !!capabilities.torch || ('torch' in settings);

            if (supportsTorch) {
               // Apply Torch
               await track.applyConstraints({
                advanced: [{ torch: true } as any],
              });
              trackRef.current = track;
              setHasTorch(true);
            } else {
               // No hardware torch, fallback to screen
               // Stop the camera track immediately as we don't need it for screen mode
               track.stop();
               setHasTorch(false);
            }
            setIsOn(true);
          } catch (err) {
            console.error("Flashlight access denied or not supported:", err);
            // Fallback to screen mode on error
            setHasTorch(false);
            setIsOn(true);
            setError("Camera access needed for hardware light.");
          }
        } else {
          setHasTorch(false);
          setIsOn(true); // Screen mode
        }
      }
    } catch (err) {
      console.error("Toggle error:", err);
      setError("Failed to toggle flashlight");
      // Force state sync to off if something went wrong
      setIsOn(false);
      stopTorch(); 
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className={`relative h-full flex flex-col items-center justify-center transition-all duration-500 ${isOn && !hasTorch ? 'bg-white' : 'bg-transparent'}`}>
      
      {/* Glow Effect Background */}
      <div className={`absolute inset-0 bg-blue-500/20 blur-[100px] transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />

      {/* Main Button */}
      <button
        onClick={toggleFlashlight}
        disabled={isToggling}
        className={`relative z-10 w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
          isOn 
            ? 'bg-gradient-to-br from-blue-400 to-cyan-300 shadow-blue-500/50 scale-105' 
            : 'bg-zinc-800 shadow-black/50 border-4 border-zinc-700'
        } ${isToggling ? 'opacity-80 cursor-wait' : 'cursor-pointer active:scale-95'}`}
      >
        <Power 
          size={64} 
          className={`transition-colors duration-300 ${isOn ? 'text-white drop-shadow-lg' : 'text-zinc-600'}`} 
        />
      </button>

      {/* Status Text */}
      <div className="mt-12 text-center relative z-10">
        <h2 className={`text-3xl font-bold tracking-wider transition-colors duration-300 ${isOn && !hasTorch ? 'text-black' : 'text-white'}`}>
          {isOn ? 'ON' : 'OFF'}
        </h2>
        <div className={`flex items-center justify-center mt-2 gap-2 text-sm font-medium ${isOn && !hasTorch ? 'text-gray-500' : 'text-gray-400'}`}>
           {hasTorch ? <Zap size={14} /> : <AlertCircle size={14} />}
           <span>{hasTorch ? 'Hardware Torch' : 'Screen Light Mode'}</span>
        </div>
      </div>

      {error && (
        <div className="absolute bottom-10 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-xs">
          {error}
        </div>
      )}
    </div>
  );
};