import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { Flashlight } from './components/Flashlight';
import { Calculator } from './components/Calculator';
import { WorkApp } from './components/WorkApp';
import { InstallPrompt } from './components/InstallPrompt';
import { SplashScreen } from './components/SplashScreen';
import { AppRoute } from './types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white flex justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
      {/* Mobile Frame Container - limits width on desktop, full on mobile */}
      <div className="w-full max-w-md h-[100dvh] bg-black/80 backdrop-blur-3xl relative shadow-2xl flex flex-col">
        
        {/* Status Bar Shim */}
        <div className="h-safe-top w-full shrink-0" />

        {/* Content Area */}
        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
        
        {/* Home Indicator Shim for iPhone */}
        <div className="h-6 w-full shrink-0 flex items-center justify-center pb-2">
           <div className="w-32 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Global Install Prompt */}
        <InstallPrompt />
      </div>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <HashRouter>
        <Layout>
          <Routes>
            <Route path={AppRoute.HOME} element={<Dashboard />} />
            <Route path={AppRoute.FLASHLIGHT} element={<Flashlight />} />
            <Route path={AppRoute.CALCULATOR} element={<Calculator />} />
            <Route path={AppRoute.WORK} element={<WorkApp />} />
          </Routes>
        </Layout>
      </HashRouter>
    </>
  );
}