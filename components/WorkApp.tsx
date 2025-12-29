import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Phone, User, Bike, FileText, MapPin, Camera, Save, X, ChevronDown, Edit2, ArrowLeft, Briefcase, Search, AlertTriangle, Wand2, Loader2, Share } from './Icons';
import { WorkEntry } from '../types';
import { Button } from './Button';
import { parseWorkEntry } from '../services/geminiService';

// Initial empty state for a new entry
const initialFormState: Partial<WorkEntry> = {
  customerName: '',
  fatherName: '',
  mobileNumber: '',
  customerPhoto: '',
  bikeNumber: '',
  engineNumber: '',
  chassisNumber: '',
  vehiclePhoto: '',
  insuranceStart: '',
  insuranceEnd: '',
  thirdPartyStart: '',
  thirdPartyEnd: '',
  kycPhotos: [],
  permanentAddress: '',
  permanentLandmark: '',
  permanentPhotos: [],
  correspondenceAddress: '',
  correspondenceLandmark: '',
  correspondencePhotos: [],
  bikeLocationAddress: '',
  bikeLocationLandmark: '',
  bikeLocationPhotos: [],
};

export const WorkApp: React.FC = () => {
  const [entries, setEntries] = useState<WorkEntry[]>(() => {
    try {
      const saved = localStorage.getItem('vk_work_entries');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load entries", e);
      return [];
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<WorkEntry>>(initialFormState);
  const [viewingEntry, setViewingEntry] = useState<WorkEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // States for Clipboard Fallback
  const [showPasteFallback, setShowPasteFallback] = useState(false);
  const [manualPasteText, setManualPasteText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('vk_work_entries', JSON.stringify(entries));
    } catch (e) {
      console.error("Storage quota exceeded", e);
      alert("Storage full! Please delete some old entries with photos.");
    }
  }, [entries]);

  // --- Handlers ---
  const handleTextChange = (field: keyof WorkEntry, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: keyof WorkEntry, isMultiple: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      files.forEach((file: File) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert(`File ${file.name} is too large (Max 5MB).`);
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setFormData(prev => {
            if (isMultiple) {
              const currentArray = (prev[field] as string[]) || [];
              return { ...prev, [field]: [...currentArray, result] };
            } else {
              return { ...prev, [field]: result };
            }
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (field: keyof WorkEntry, index?: number) => {
    setFormData(prev => {
      const val = prev[field];
      if (Array.isArray(val) && typeof index === 'number') {
        return { ...prev, [field]: val.filter((_, i) => i !== index) };
      } else {
        return { ...prev, [field]: '' };
      }
    });
  };

  const handleAiFill = async () => {
    try {
      // Try to read clipboard directly
      const text = await navigator.clipboard.readText();
      if (!text) {
        throw new Error("Empty clipboard");
      }
      // If successful, process immediately
      await processAiText(text);
    } catch (error) {
      // If blocked or empty, show manual fallback modal
      console.log("Clipboard access denied or empty, showing manual input.", error);
      setShowPasteFallback(true);
    }
  };

  const handleManualAiSubmit = async () => {
    if (!manualPasteText.trim()) return;
    setShowPasteFallback(false);
    await processAiText(manualPasteText);
    setManualPasteText('');
  };

  const processAiText = async (text: string) => {
    setIsAiLoading(true);
    try {
      const parsedData = await parseWorkEntry(text);
      if (parsedData) {
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
      } else {
        alert("Could not extract data from the text.");
      }
    } catch (error) {
      console.error("AI Processing Error", error);
      alert("Failed to process text.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No strict validation here, allowing partial saves as requested
    
    if (isEditing && formData.id) {
      setEntries(prev => prev.map(entry => entry.id === formData.id ? { ...formData } as WorkEntry : entry));
    } else {
      const newEntry: WorkEntry = {
        ...formData,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
      } as WorkEntry;
      setEntries([newEntry, ...entries]);
    }
    closeFormModal();
  };

  const initiateDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setEntries(prevEntries => prevEntries.filter(e => e.id !== deleteId));
      setDeleteId(null);
      setViewingEntry(null);
    }
  };

  const openNewEntryModal = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (entry: WorkEntry) => {
    setFormData(entry);
    setIsEditing(true);
    setViewingEntry(null);
    setShowModal(true);
  };

  const closeFormModal = () => {
    setShowModal(false);
    setFormData(initialFormState);
    setIsEditing(false);
  };

  const filteredEntries = entries.filter(entry => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (entry.customerName?.toLowerCase() || '').includes(term) ||
      (entry.bikeNumber?.toLowerCase() || '').includes(term) ||
      (entry.mobileNumber || '').includes(term)
    );
  });

  // --- UI Components ---
  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-3 mb-6 mt-10 pb-2 border-b border-white/10 first:mt-2">
      <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/10">
        <Icon size={18} className="text-emerald-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-200">{title}</h3>
    </div>
  );

  const InputField = ({ label, value, onChange, placeholder, type = "text", required = false }: any) => (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-400 mb-2 ml-1 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:bg-zinc-800 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
      />
    </div>
  );

  const TextAreaField = ({ label, value, onChange, placeholder, required = false }: any) => (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-400 mb-2 ml-1 uppercase tracking-wider">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:bg-zinc-800 outline-none transition-all resize-none shadow-sm"
      />
    </div>
  );

  const DateInputField = ({ label, value, onChange }: any) => (
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-400 mb-2 ml-1 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:bg-zinc-800 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all appearance-none shadow-sm"
        />
        <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
      </div>
    </div>
  );

  const PhotoUpload = ({ label, field, isMultiple = false }: { label: string, field: keyof WorkEntry, isMultiple?: boolean }) => {
    const value = formData[field];
    const hasValue = isMultiple ? (value as string[])?.length > 0 : !!value;

    return (
      <div className="mb-8">
        <label className="block text-xs font-semibold text-gray-400 mb-2 ml-1 uppercase tracking-wider">{label}</label>
        
        <label className="cursor-pointer group relative flex flex-col items-center justify-center gap-3 w-full bg-zinc-800/30 border-2 border-white/10 border-dashed rounded-3xl p-8 hover:bg-zinc-800/60 hover:border-emerald-500/40 transition-all active:scale-[0.99] shadow-inner">
          <div className="bg-zinc-800 p-4 rounded-full group-hover:bg-zinc-700 transition-colors shadow-lg">
            <Camera size={24} className="text-emerald-400" />
          </div>
          <div className="text-center">
             <span className="text-sm font-medium text-gray-300 group-hover:text-emerald-200 transition-colors block">
               {hasValue && !isMultiple ? 'Change File' : 'No file chosen'}
             </span>
             <span className="text-xs text-gray-500 mt-1 block">Tap to upload</span>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            multiple={isMultiple} 
            className="hidden" 
            onChange={(e) => handleFileChange(field, isMultiple, e)} 
          />
        </label>

        {hasValue && (
          <div className={`mt-4 ${isMultiple ? 'grid grid-cols-3 gap-3' : 'flex justify-center'}`}>
            {isMultiple ? (
              (value as string[]).map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(field, idx)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white backdrop-blur-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="relative w-full max-w-xs aspect-video rounded-3xl overflow-hidden border border-white/10 group shadow-lg">
                <img src={value as string} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(field)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white backdrop-blur-sm"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const DetailRow = ({ label, value }: { label: string, value?: string }) => {
    if (!value) return null;
    return (
      <div className="mb-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
        <span className="text-xs text-gray-500 block uppercase tracking-wide mb-1.5">{label}</span>
        <span className="text-base text-gray-100 font-medium leading-relaxed">{value}</span>
      </div>
    );
  };

  const DetailPhotos = ({ label, photos, single }: { label: string, photos?: string[] | string, single?: boolean }) => {
    if (!photos || (Array.isArray(photos) && photos.length === 0)) return null;
    
    return (
      <div className="mt-6 mb-8">
        <span className="text-xs text-gray-500 block mb-3 uppercase tracking-wide">{label}</span>
        <div className={`flex gap-3 overflow-x-auto pb-4 no-scrollbar ${single ? 'justify-center' : ''}`}>
          {single ? (
             <div className="w-full max-w-sm h-56 rounded-3xl overflow-hidden border border-white/10 shadow-lg">
               <img src={photos as string} alt={label} className="w-full h-full object-cover" />
             </div>
          ) : (
            (photos as string[]).map((p, i) => (
              <div key={i} className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-md">
                <img src={p} alt={`${label} ${i}`} className="w-full h-full object-cover" />
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/30 backdrop-blur-md rounded-t-[2.5rem] p-5 overflow-hidden relative border-t border-white/5">
      {/* App Header */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-300">
            WorkLog
          </h2>
          <p className="text-gray-400 text-sm font-medium">Customer Database</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-3 rounded-full border border-emerald-500/10">
           <Briefcase className="w-6 h-6 text-emerald-400" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-800/80 border border-white/5 rounded-full py-4 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-24 no-scrollbar">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-600">
            {searchTerm ? (
              <>
                 <Search className="w-16 h-16 mb-4 opacity-50" />
                 <p className="font-medium">No matches found</p>
              </>
            ) : (
              <>
                <FileText className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-medium">No entries yet</p>
              </>
            )}
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div 
              key={entry.id} 
              onClick={() => setViewingEntry(entry)}
              className="group bg-zinc-900/60 border border-white/5 p-5 rounded-[2rem] hover:bg-zinc-800/80 transition-all relative overflow-hidden active:scale-[0.98] cursor-pointer shadow-lg hover:shadow-xl"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full -mr-6 -mt-6 pointer-events-none transition-opacity group-hover:from-emerald-500/10" />
               
               <div className="flex justify-between items-center relative z-10">
                 <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-zinc-700/50 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {entry.customerPhoto ? (
                        <img src={entry.customerPhoto} alt="C" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-gray-600" />
                      )}
                   </div>
                   
                   <div>
                     <h3 className="font-bold text-lg text-white leading-tight">
                       {entry.customerName || 'Unnamed'}
                     </h3>
                     <div className="flex items-center text-emerald-400 text-sm mt-1 font-medium bg-emerald-500/5 px-2 py-0.5 rounded-lg w-fit">
                       <Bike size={14} className="mr-1.5" />
                       {entry.bikeNumber || 'No Bike No.'}
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="absolute bottom-8 right-6 z-20">
        <button 
          onClick={openNewEntryModal}
          className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.4)] text-white hover:scale-110 transition-transform active:scale-95 hover:shadow-emerald-400/50"
        >
          <Plus size={32} />
        </button>
      </div>

      {/* --- DETAIL & MODALS --- */}
      {(viewingEntry || showModal) && !deleteId && !showPasteFallback && (
        <div className="absolute inset-0 z-40 bg-[#09090b] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
           {/* Modal Header */}
           <div className="flex items-center p-5 border-b border-white/5 bg-zinc-900/80 backdrop-blur-xl sticky top-0 z-30">
            <button 
              onClick={closeFormModal} 
              className="p-2 -ml-2 mr-3 rounded-full hover:bg-white/10 text-gray-300 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h3 className="text-xl font-bold text-white tracking-wide flex-1">
              {viewingEntry ? 'Entry Details' : (isEditing ? 'Edit Entry' : 'Add New Entry')}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pb-32">
             {viewingEntry ? (
               // Detail View Content
               <div className="animate-in fade-in duration-300">
                 <div className="flex flex-col items-center mb-8">
                    <div className="w-32 h-32 rounded-full bg-zinc-800 overflow-hidden border-4 border-zinc-800 shadow-2xl mb-4 relative">
                       {viewingEntry.customerPhoto ? (
                         <img src={viewingEntry.customerPhoto} className="w-full h-full object-cover" />
                       ) : <User className="w-full h-full p-8 text-gray-700" />}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-1 text-center">{viewingEntry.customerName || 'N/A'}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-emerald-400 font-mono text-sm border border-emerald-500/10">
                        {viewingEntry.bikeNumber}
                      </div>
                      <div className="px-3 py-1 bg-zinc-800 rounded-full text-gray-400 text-sm border border-white/5">
                        {viewingEntry.date}
                      </div>
                    </div>
                 </div>

                 <SectionHeader icon={User} title="Customer Details" />
                 <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 space-y-2">
                   <DetailRow label="Father's Name" value={viewingEntry.fatherName} />
                   <DetailRow label="Mobile Number" value={viewingEntry.mobileNumber} />
                 </div>
                 
                 <SectionHeader icon={Bike} title="Vehicle Details" />
                 <DetailPhotos label="Vehicle Photo" photos={viewingEntry.vehiclePhoto} single />
                 <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 space-y-2">
                   <DetailRow label="Bike Number" value={viewingEntry.bikeNumber} />
                   <DetailRow label="Engine Number" value={viewingEntry.engineNumber} />
                   <DetailRow label="Chassis Number" value={viewingEntry.chassisNumber} />
                 </div>

                 {(viewingEntry.insuranceStart || viewingEntry.thirdPartyStart) && (
                   <>
                     <SectionHeader icon={FileText} title="Insurance Details" />
                     <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                           <DetailRow label="Insurance Start" value={viewingEntry.insuranceStart} />
                           <DetailRow label="Insurance End" value={viewingEntry.insuranceEnd} />
                           <DetailRow label="TP Start" value={viewingEntry.thirdPartyStart} />
                           <DetailRow label="TP End" value={viewingEntry.thirdPartyEnd} />
                        </div>
                     </div>
                   </>
                 )}

                 {viewingEntry.kycPhotos && viewingEntry.kycPhotos.length > 0 && (
                   <>
                     <SectionHeader icon={FileText} title="KYC Documents" />
                     <DetailPhotos label="Uploaded Documents" photos={viewingEntry.kycPhotos} />
                   </>
                 )}

                 {(viewingEntry.permanentAddress || viewingEntry.correspondenceAddress || viewingEntry.bikeLocationAddress) && (
                   <>
                     <SectionHeader icon={MapPin} title="Locations" />
                     <div className="space-y-6">
                        {viewingEntry.permanentAddress && (
                          <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5">
                            <h4 className="text-emerald-400 font-bold mb-4 text-sm uppercase tracking-wider">Permanent Address</h4>
                            <DetailRow label="Address" value={viewingEntry.permanentAddress} />
                            <DetailRow label="Landmark" value={viewingEntry.permanentLandmark} />
                            <DetailPhotos label="Photos" photos={viewingEntry.permanentPhotos} />
                          </div>
                        )}
                        {viewingEntry.correspondenceAddress && (
                          <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5">
                             <h4 className="text-emerald-400 font-bold mb-4 text-sm uppercase tracking-wider">Correspondence Address</h4>
                             <DetailRow label="Address" value={viewingEntry.correspondenceAddress} />
                             <DetailRow label="Landmark" value={viewingEntry.correspondenceLandmark} />
                             <DetailPhotos label="Photos" photos={viewingEntry.correspondencePhotos} />
                          </div>
                        )}
                        {viewingEntry.bikeLocationAddress && (
                          <div className="bg-zinc-900/30 p-6 rounded-3xl border border-white/5">
                             <h4 className="text-emerald-400 font-bold mb-4 text-sm uppercase tracking-wider">Bike Location</h4>
                             <DetailRow label="Address" value={viewingEntry.bikeLocationAddress} />
                             <DetailRow label="Landmark" value={viewingEntry.bikeLocationLandmark} />
                             <DetailPhotos label="Photos" photos={viewingEntry.bikeLocationPhotos} />
                          </div>
                        )}
                     </div>
                   </>
                 )}
               </div>
             ) : (
               // Edit/Add Form Content
               <form id="entryForm" onSubmit={handleSubmit} className="animate-in slide-in-from-bottom-4 duration-500">
                  {!isEditing && (
                    <button 
                      type="button"
                      onClick={handleAiFill}
                      disabled={isAiLoading}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 text-emerald-300 transition-all mb-2 hover:border-emerald-500/40 active:scale-[0.98]"
                    >
                      {isAiLoading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                      <span className="font-semibold">Auto-Fill from Clipboard</span>
                    </button>
                  )}
                  <p className="text-xs text-gray-500 text-center mb-8">Tap to magically fill details from copied text</p>

                  <SectionHeader icon={User} title="Customer Details" />
                  <InputField label="Customer Name" required value={formData.customerName} onChange={(v: string) => handleTextChange('customerName', v)} placeholder="Full Name" />
                  <InputField label="Father's Name" required value={formData.fatherName} onChange={(v: string) => handleTextChange('fatherName', v)} placeholder="Father Name" />
                  <InputField label="Mobile Number" required value={formData.mobileNumber} onChange={(v: string) => handleTextChange('mobileNumber', v)} placeholder="Phone Number" type="tel" />
                  <PhotoUpload label="Customer Photo" field="customerPhoto" />

                  <SectionHeader icon={Bike} title="Vehicle Details" />
                  <InputField label="Bike Number" required value={formData.bikeNumber} onChange={(v: string) => handleTextChange('bikeNumber', v)} placeholder="MH 12 XX 0000" />
                  <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
                    <InputField label="Engine Number" required value={formData.engineNumber} onChange={(v: string) => handleTextChange('engineNumber', v)} />
                    <InputField label="Chassis Number" required value={formData.chassisNumber} onChange={(v: string) => handleTextChange('chassisNumber', v)} />
                  </div>
                  <PhotoUpload label="Vehicle Photo" field="vehiclePhoto" />

                  <SectionHeader icon={FileText} title="Insurance Details" />
                  <div className="grid grid-cols-2 gap-4">
                    <DateInputField label="Insurance Start" value={formData.insuranceStart} onChange={(v: string) => handleTextChange('insuranceStart', v)} />
                    <DateInputField label="Insurance End" value={formData.insuranceEnd} onChange={(v: string) => handleTextChange('insuranceEnd', v)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <DateInputField label="TP Start Date" value={formData.thirdPartyStart} onChange={(v: string) => handleTextChange('thirdPartyStart', v)} />
                    <DateInputField label="TP End Date" value={formData.thirdPartyEnd} onChange={(v: string) => handleTextChange('thirdPartyEnd', v)} />
                  </div>

                  <SectionHeader icon={FileText} title="KYC Documents" />
                  <PhotoUpload label="Upload KYC Photos (Aadhaar, PAN, etc.)" field="kycPhotos" isMultiple />

                  <SectionHeader icon={MapPin} title="Permanent Address" />
                  <TextAreaField label="Full Address" required value={formData.permanentAddress} onChange={(v: string) => handleTextChange('permanentAddress', v)} placeholder="House No, Street, Area..." />
                  <InputField label="Location / Landmark" value={formData.permanentLandmark} onChange={(v: string) => handleTextChange('permanentLandmark', v)} placeholder="Near..." />
                  <PhotoUpload label="Upload Address Photos" field="permanentPhotos" isMultiple />

                  <SectionHeader icon={MapPin} title="Address of Correspondence" />
                  <TextAreaField label="Full Address" required value={formData.correspondenceAddress} onChange={(v: string) => handleTextChange('correspondenceAddress', v)} placeholder="House No, Street, Area..." />
                  <InputField label="Location / Landmark" value={formData.correspondenceLandmark} onChange={(v: string) => handleTextChange('correspondenceLandmark', v)} placeholder="Near..." />
                  <PhotoUpload label="Upload Address Photos" field="correspondencePhotos" isMultiple />

                  <SectionHeader icon={MapPin} title="Bike Location" />
                  <TextAreaField label="Full Address" required value={formData.bikeLocationAddress} onChange={(v: string) => handleTextChange('bikeLocationAddress', v)} placeholder="Where is the bike parked?" />
                  <InputField label="Location / Landmark" value={formData.bikeLocationLandmark} onChange={(v: string) => handleTextChange('bikeLocationLandmark', v)} placeholder="Near..." />
                  <PhotoUpload label="Upload Bike Location Photos" field="bikeLocationPhotos" isMultiple />
               </form>
             )}
          </div>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-[#09090b]/90 backdrop-blur-lg flex gap-4 z-40 border-t border-white/5">
            {viewingEntry ? (
              <>
                <Button variant="danger" onClick={() => initiateDelete(viewingEntry.id)} className="flex-1 rounded-2xl">
                  <Trash2 size={20} className="mr-2" /> Delete
                </Button>
                <Button onClick={() => openEditModal(viewingEntry)} className="flex-[2] rounded-2xl">
                  <Edit2 size={20} className="mr-2" /> Edit
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={closeFormModal} className="flex-1 rounded-2xl">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-[2] rounded-2xl">
                  <Save size={20} className="mr-2" /> {isEditing ? 'Update' : 'Save'}
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Paste Fallback Modal */}
      {showPasteFallback && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-6 w-full max-w-sm shadow-2xl flex flex-col h-[70vh]">
              <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                      <Wand2 className="text-emerald-400" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Manual AI Fill</h3>
                 </div>
                 <button onClick={() => setShowPasteFallback(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                   <X size={20} className="text-gray-400" />
                 </button>
              </div>
              
              <div className="flex-1 mb-4 flex flex-col">
                <p className="text-sm text-gray-400 mb-2">We couldn't access your clipboard automatically. Please paste your text below:</p>
                <textarea
                  value={manualPasteText}
                  onChange={(e) => setManualPasteText(e.target.value)}
                  placeholder="Paste details here (e.g., 'Customer John Doe, Bike MH 12 3456...')"
                  className="flex-1 w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:bg-zinc-800 outline-none resize-none text-base leading-relaxed"
                />
              </div>
              
              <Button onClick={handleManualAiSubmit} fullWidth className="rounded-2xl">
                {isAiLoading ? (
                  <><Loader2 size={20} className="animate-spin mr-2"/> Processing...</>
                ) : (
                  <><Save size={20} className="mr-2" /> Process Text</>
                )}
              </Button>
           </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl">
             <div className="flex flex-col items-center text-center mb-8">
               <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500">
                 <AlertTriangle size={40} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Are you sure?</h3>
               <p className="text-gray-400">This action cannot be undone.</p>
             </div>
             <div className="flex gap-4">
               <Button variant="secondary" onClick={() => setDeleteId(null)} fullWidth className="rounded-2xl">Cancel</Button>
               <Button variant="danger" onClick={confirmDelete} fullWidth className="rounded-2xl">Delete</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};