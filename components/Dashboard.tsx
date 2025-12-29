import React from 'react';
import { NavigationItem, AppRoute } from '../types';
import { Zap, CalculatorIcon as CalcIcon, Briefcase } from './Icons';
import { Link } from 'react-router-dom';

const apps: NavigationItem[] = [
  {
    name: 'Light',
    route: AppRoute.FLASHLIGHT,
    icon: <Zap size={36} className="drop-shadow-md" />,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'Calc',
    route: AppRoute.CALCULATOR,
    icon: <CalcIcon size={36} className="drop-shadow-md" />,
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Work',
    route: AppRoute.WORK,
    icon: <Briefcase size={36} className="drop-shadow-md" />,
    color: 'from-emerald-500 to-teal-500',
  },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full pt-12 px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-2">VK Apps</h1>
        <p className="text-gray-400 text-sm font-medium tracking-wide">Premium Utilities Suite</p>
      </div>
      
      <div className="grid grid-cols-2 gap-5">
        {apps.map((app) => (
          <Link
            key={app.name}
            to={app.route}
            className="group relative aspect-[0.9] bg-zinc-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-md transition-all duration-300 hover:bg-zinc-800/60 hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center shadow-xl shadow-black/20"
          >
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${app.color}`} />
            
            <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg mb-5 group-hover:shadow-${app.color.split('-')[1]}-500/40 transition-shadow duration-300`}>
               {app.icon}
            </div>
            
            <span className="text-gray-200 font-semibold tracking-wide text-lg">{app.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};