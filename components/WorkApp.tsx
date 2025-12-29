import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Phone, User, Bike, FileText, MapPin, Camera, Save, X, ChevronDown, Edit2, ArrowLeft, Briefcase, Search, AlertTriangle, Wand2, Loader2 } from './Icons';
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
        if (file.size > 3 * 1024 * 1024) { // 3MB limit
          alert(`File ${file.name} is too large (Max 3MB).`);
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
      setIsAiLoading(true);
      const text = await navigator.clipboard.readText();
      if (!text) {
        alert("Clipboard is empty");
        setIsAiLoading(false);
        return;
      }
      
      const parsedData = await parseWorkEntry(text);
      if (parsedData) {
        setFormData(prev => ({
          ...prev,
          ...parsedData
        }));
      } else {
        alert("Could not extract data from clipboard text.");
      }
    } catch (error) {
      console.error("AI Fill Error", error);
      alert("Failed to read from clipboard. Please allow permission.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="flex items-center gap-3 mb-4 mt-8 pb-2 border-b border-white/10">
      <div className="p-2 rounded-xl bg-emerald-500/10">
        <Icon size={18} className="text-emerald-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-200">{title}</h3>
    </div>
  );

  const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-2 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:bg-zinc-800 focus:ring-1 focus:ring-emerald-500/20 outline-none transition-all"
      />
    </div>
  );

  const TextAreaField = ({ label, value, onChange, placeholder }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-2 uppercase tracking-wider">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:border-emerald-500/50 focus:bg-zinc-800 outline-none transition-all resize-none"
      />
    </div>
  );

  const PhotoUpload = ({ label, field, isMultiple = false }: { label: string, field: keyof WorkEntry, isMultiple?: boolean }) => {
    const value = formData[field];
    const hasValue = isMultiple ? (value as string[])?.length > 0 : !!value;

    return (
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-400 mb-2 ml-2 uppercase tracking-wider">{label}</label>
        
        <label className="cursor-pointer group relative flex flex-col items-center justify-center gap-3 w-full bg-zinc-800/30 border-2 border-white/5 border-dashed rounded-3xl p-6 hover:bg-zinc-800/60 hover:border-emerald-500/30 transition-all active:scale-[0.99]">
          <div className="bg-emerald-500/10 p-3 rounded-full group-hover:bg-emerald-500/20 transition-colors">
            <Camera size={24} className="text-emerald-400" />
          </div>
          <span className="text-sm font-medium text-gray-400 group-hover:text-emerald-200 transition-colors">
            {hasValue && !isMultiple ? 'Change Photo' : 'Upload Files'}
          </span>
          <input 
            type="file" 
            accept="image/*" 
            multiple={isMultiple} 
            className="hidden" 
            onChange={(e) => handleFileChange(field, isMultiple, e)} 
          />
        </label>

        {hasValue && (
          <div className={`mt-4 ${isMultiple ? 'grid grid-cols-4 gap-3' : 'flex justify-center'}`}>
            {isMultiple ? (
              (value as string[]).map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(field, idx)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
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
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
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
      <div className="mb-3">
        <span className="text-xs text-gray-500 block uppercase tracking-wide mb-1">{label}</span>
        <span className="text-base text-gray-100 font-medium">{value}</span>
      </div>
    );
  };

  const DetailPhotos = ({ label, photos, single }: { label: string, photos?: string[] | string, single?: boolean }) => {
    if (!photos || (Array.isArray(photos) && photos.length === 0)) return null;
    
    return (
      <div className="mt-4 mb-6">
        <span className="text-xs text-gray-500 block mb-3 uppercase tracking-wide">{label}</span>
        <div className={`flex gap-3 overflow-x-auto pb-2 no-scrollbar ${single ? 'justify-center' : ''}`}>
          {single ? (
             <div className="w-full max-w-sm h-56 rounded-3xl overflow-hidden border border-white/10 shadow-lg">
               <img src={photos as string} alt={label} className="w-full h-full object-cover" />
             </div>
          ) : (
            (photos as string[]).map((p, i) => (
              <div key={i} className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-md">
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

      {/* --- DETAIL & MODALS (Kept logic, improved containers) --- */}
      {(viewingEntry || showModal) && !deleteId && (
        <div className="absolute inset-0 z-40 bg-[#09090b] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
           {/* Header */}
           <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-10">
            <button onClick={viewingEntry ? () => setViewingEntry(null) : closeFormModal} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <ChevronDown size={24} className={viewingEntry ? "rotate-90" : "rotate-90"} />
            </button>
            <h3 className="text-lg font-bold text-white tracking-wide">{viewingEntry ? 'Details' : (isEditing ? 'Edit Entry' : 'New Entry')}</h3>
            <div className="w-10"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 pb-32">
             {viewingEntry ? (
               // Detail View Content
               <>
                 <div className="flex flex-col items-center mb-8">
                    <div className="w-28 h-28 rounded-full bg-zinc-800 overflow-hidden border-4 border-zinc-800 shadow-2xl mb-4">
                       {viewingEntry.customerPhoto ? (
                         <img src={viewingEntry.customerPhoto} className="w-full h-full object-cover" />
                       ) : <User className="w-full h-full p-6 text-gray-700" />}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{viewingEntry.customerName || 'N/A'}</h2>
                    <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-emerald-400 font-mono text-sm border border-emerald-500/10">
                      {viewingEntry.bikeNumber}
                    </div>
                 </div>

                 <SectionHeader icon={User} title="Personal Info" />
                 <div className="bg-zinc-900/30 p-5 rounded-3xl border border-white/5 space-y-4">
                   <DetailRow label="Father Name" value={viewingEntry.fatherName} />
                   <DetailRow label="Mobile" value={viewingEntry.mobileNumber} />
                 </div>
                 
                 <SectionHeader icon={Bike} title="Vehicle Info" />
                 <DetailPhotos label="Vehicle Photo" photos={viewingEntry.vehiclePhoto} single />
                 <div className="bg-zinc-900/30 p-5 rounded-3xl border border-white/5 space-y-4">
                   <DetailRow label="Engine No." value={viewingEntry.engineNumber} />
                   <DetailRow label="Chassis No." value={viewingEntry.chassisNumber} />
                 </div>

                 {(viewingEntry.permanentAddress || viewingEntry.correspondenceAddress) && (
                   <>
                     <SectionHeader icon={MapPin} title="Addresses" />
                     <div className="bg-zinc-900/30 p-5 rounded-3xl border border-white/5 space-y-6">
                        {viewingEntry.permanentAddress && (
                          <div>
                            <DetailRow label="Permanent Address" value={viewingEntry.permanentAddress} />
                            <DetailPhotos label="Photos" photos={viewingEntry.permanentPhotos} />
                          </div>
                        )}
                        {viewingEntry.correspondenceAddress && (
                          <div className="pt-4 border-t border-white/5">
                             <DetailRow label="Correspondence" value={viewingEntry.correspondenceAddress} />
                             <DetailPhotos label="Photos" photos={viewingEntry.correspondencePhotos} />
                          </div>
                        )}
                     </div>
                   </>
                 )}
               </>
             ) : (
               // Edit/Add Form Content
               <form id="entryForm" onSubmit={handleSubmit} className="space-y-2">
                  {!isEditing && (
                    <button 
                      type="button"
                      onClick={handleAiFill}
                      disabled={isAiLoading}
                      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 text-emerald-300 transition-all mb-6 hover:border-emerald-500/40 active:scale-[0.98]"
                    >
                      {isAiLoading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                      <span className="font-semibold">Auto-Fill from Clipboard</span>
                    </button>
                  )}

                  <SectionHeader icon={User} title="Customer" />
                  <InputField label="Name *" value={formData.customerName} onChange={(v: string) => handleTextChange('customerName', v)} placeholder="Full Name" />
                  <InputField label="Mobile *" value={formData.mobileNumber} onChange={(v: string) => handleTextChange('mobileNumber', v)} placeholder="Phone Number" type="tel" />
                  <PhotoUpload label="Customer Photo" field="customerPhoto" />

                  <SectionHeader icon={Bike} title="Vehicle" />
                  <InputField label="Bike Number *" value={formData.bikeNumber} onChange={(v: string) => handleTextChange('bikeNumber', v)} placeholder="MH 12 XX 0000" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Engine No." value={formData.engineNumber} onChange={(v: string) => handleTextChange('engineNumber', v)} />
                    <InputField label="Chassis No." value={formData.chassisNumber} onChange={(v: string) => handleTextChange('chassisNumber', v)} />
                  </div>
                  <PhotoUpload label="Vehicle Photo" field="vehiclePhoto" />

                  <SectionHeader icon={MapPin} title="Address" />
                  <TextAreaField label="Permanent Address" value={formData.permanentAddress} onChange={(v: string) => handleTextChange('permanentAddress', v)} placeholder="Full Address" />
                  <PhotoUpload label="Address Photos" field="permanentPhotos" isMultiple />
               </form>
             )}
          </div>

          {/* Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#09090b] to-[#09090b]/90 backdrop-blur-lg flex gap-4 z-20">
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