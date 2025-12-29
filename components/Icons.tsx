import React from 'react';

export const IconBase = ({ size = 24, className = '', children, ...props }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className} 
    {...props}
  >
    {children}
  </svg>
);

// Navigation & Actions
export const Plus = (props: any) => <IconBase {...props}><path d="M5 12h14"/><path d="M12 5v14"/></IconBase>;
export const X = (props: any) => <IconBase {...props}><path d="M18 6 6 18"/><path d="M6 6 18 18"/></IconBase>;
export const ArrowLeft = (props: any) => <IconBase {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></IconBase>;
export const ChevronDown = (props: any) => <IconBase {...props}><path d="m6 9 6 6 6-6"/></IconBase>;
export const Search = (props: any) => <IconBase {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></IconBase>;
export const Trash2 = (props: any) => <IconBase {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></IconBase>;
export const Edit2 = (props: any) => <IconBase {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></IconBase>;
export const Save = (props: any) => <IconBase {...props}><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></IconBase>;
export const Share = (props: any) => <IconBase {...props}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></IconBase>;

// Work App Specific
export const User = (props: any) => <IconBase {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></IconBase>;
export const Phone = (props: any) => <IconBase {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></IconBase>;
export const Calendar = (props: any) => <IconBase {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></IconBase>;
export const MapPin = (props: any) => <IconBase {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></IconBase>;
export const Briefcase = (props: any) => <IconBase {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></IconBase>;
export const FileText = (props: any) => <IconBase {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></IconBase>;
export const Camera = (props: any) => <IconBase {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></IconBase>;
export const Bike = (props: any) => <IconBase {...props}><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2"/></IconBase>;
export const Wand2 = (props: any) => <IconBase {...props}><path d="m19 2 2 2-2 2-2-2 2-2Z"/><path d="m5 13 4 4"/><path d="m21.2 5.2-12 12a2.8 2.8 0 1 1-4-4l12-12a2 2 0 0 1 2.8 2.8Z"/><path d="M15 5 5 15"/><path d="m2 10 2 2-2 2-2-2 2-2Z"/><path d="m10 2 2 2-2 2-2-2 2-2Z"/></IconBase>;
export const Loader2 = (props: any) => <IconBase {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></IconBase>;

// Flashlight & Dashboard
export const Power = (props: any) => <IconBase {...props}><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" x2="12" y1="2" y2="12"/></IconBase>;
export const Zap = (props: any) => <IconBase {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></IconBase>;
export const AlertCircle = (props: any) => <IconBase {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></IconBase>;
export const AlertTriangle = (props: any) => <IconBase {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></IconBase>;
export const CalculatorIcon = (props: any) => <IconBase {...props}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></IconBase>;
export const Smartphone = (props: any) => <IconBase {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></IconBase>;
