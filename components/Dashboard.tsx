import React from 'react';
import { NavigationItem, AppRoute } from '../types';
import { Zap, Calculator as CalcIcon, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const apps: NavigationItem[] = [
  {
    name: 'Light',
    route: AppRoute.FLASHLIGHT,
    icon: <Zap size={32} />,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'Calc',
    route: AppRoute.CALCULATOR,
    icon: <CalcIcon size={32} />,
    color: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Work',
    route: AppRoute.WORK,
    icon: <Briefcase size={32} />,
    color: 'from-emerald-500 to-teal-500',
  },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-full pt-12 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-1">VK Apps</h1>
        <p className="text-gray-400 text-sm font-medium">Premium Utilities</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {apps.map((app) => (
          <Link
            key={app.name}
            to={app.route}
            className="group relative aspect-square bg-zinc-800/50 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:bg-zinc-800 hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center"
          >
            {/* Background Gradient Blob */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${app.color}`} />
            
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:shadow-${app.color.split('-')[1]}-500/40 transition-shadow duration-300`}>
               {app.icon}
            </div>
            
            <span className="text-gray-200 font-medium tracking-wide">{app.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
