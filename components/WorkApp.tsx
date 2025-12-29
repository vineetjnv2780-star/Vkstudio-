import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Phone, User, Bike, FileText, MapPin, Camera, Save, X, ChevronDown, Edit2, ArrowLeft, Briefcase, Search, AlertTriangle } from 'lucide-react';
import { WorkEntry } from '../types';
import { Button } from './Button';

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
  const [deleteId, setDeleteId] = useState<string | null>(null); // State for custom delete confirmation

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && formData.id) {
      // Update Existing
      setEntries(prev => prev.map(entry => entry.id === formData.id ? { ...formData } as WorkEntry : entry));
    } else {
      // Create New
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
      setViewingEntry(null); // Close detail view
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
    setViewingEntry(null); // Close detail view
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
      (entry.mobileNumber || '').includes(term) ||
      (entry.fatherName?.toLowerCase() || '').includes(term) ||
      (entry.engineNumber?.toLowerCase() || '').includes(term) ||
      (entry.chassisNumber?.toLowerCase() || '').includes(term) ||
      (entry.permanentAddress?.toLowerCase() || '').includes(term)
    );
  });

  // --- UI Components ---

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-3 mt-6 pb-1 border-b border-white/10">
      <Icon size={18} className="text-emerald-400" />
      <h3 className="text-lg font-semibold text-emerald-100">{title}</h3>
    </div>
  );

  const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1 ml-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
      />
    </div>
  );

  const TextAreaField = ({ label, value, onChange, placeholder }: any) => (
    <div className="mb-3">
      <label className="block text-xs text-gray-400 mb-1 ml-1">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-emerald-500 outline-none transition-all resize-none"
      />
    </div>
  );

  const PhotoUpload = ({ label, field, isMultiple = false }: { label: string, field: keyof WorkEntry, isMultiple?: boolean }) => {
    const value = formData[field];
    const hasValue = isMultiple ? (value as string[])?.length > 0 : !!value;

    return (
      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-2 ml-1">{label}</label>
        
        {/* Upload Button */}
        <label className="cursor-pointer group relative flex items-center justify-center gap-3 w-full bg-zinc-800/30 border border-white/10 border-dashed rounded-xl px-4 py-3 hover:bg-zinc-800/60 transition-all active:scale-[0.99]">
          <div className="bg-emerald-500/10 p-2 rounded-full group-hover:bg-emerald-500/20 transition-colors">
            <Camera size={18} className="text-emerald-400" />
          </div>
          <span className="text-sm text-gray-400 group-hover:text-gray-200">{hasValue && !isMultiple ? 'Change Photo' : 'Choose Files'}</span>
          <input 
            type="file" 
            accept="image/*" 
            multiple={isMultiple} 
            className="hidden" 
            onChange={(e) => handleFileChange(field, isMultiple, e)} 
          />
        </label>

        {/* Previews */}
        {hasValue && (
          <div className={`mt-3 ${isMultiple ? 'grid grid-cols-4 gap-2' : 'flex justify-center'}`}>
            {isMultiple ? (
              (value as string[]).map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(field, idx)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/10 group">
                <img src={value as string} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(field)}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                >
                  <Trash2 size={20} />
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
      <div className="mb-2">
        <span className="text-xs text-gray-500 block">{label}</span>
        <span className="text-sm text-gray-200 font-medium">{value}</span>
      </div>
    );
  };

  const DetailPhotos = ({ label, photos, single }: { label: string, photos?: string[] | string, single?: boolean }) => {
    if (!photos || (Array.isArray(photos) && photos.length === 0)) return null;
    
    return (
      <div className="mt-3 mb-4">
        <span className="text-xs text-gray-500 block mb-2">{label}</span>
        <div className={`flex gap-2 overflow-x-auto pb-2 no-scrollbar ${single ? 'justify-center' : ''}`}>
          {single ? (
             <div className="w-48 h-48 rounded-lg overflow-hidden border border-white/10">
               <img src={photos as string} alt={label} className="w-full h-full object-cover" />
             </div>
          ) : (
            (photos as string[]).map((p, i) => (
              <div key={i} className="w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-white/10">
                <img src={p} alt={`${label} ${i}`} className="w-full h-full object-cover" />
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-sm rounded-t-3xl p-4 overflow-hidden relative">
      {/* App Header */}
      <div className="flex justify-between items-center mb-6 pt-2">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Records
          </h2>
          <p className="text-gray-400 text-sm">Customer & Vehicle Data</p>
        </div>
        <div className="bg-emerald-500/10 p-2 rounded-full">
           <Briefcase className="w-6 h-6 text-emerald-400" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search by name, bike no, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-800/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Main List */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-20 no-scrollbar">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 opacity-60">
            {searchTerm ? (
              <>
                 <Search className="w-12 h-12 mb-2" />
                 <p>No results found.</p>
              </>
            ) : (
              <>
                <FileText className="w-12 h-12 mb-2" />
                <p>No records found.</p>
              </>
            )}
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div 
              key={entry.id} 
              onClick={() => setViewingEntry(entry)}
              className="group bg-zinc-900/80 border border-white/5 p-4 rounded-2xl hover:bg-zinc-800/80 transition-all relative overflow-hidden active:scale-[0.98] cursor-pointer"
            >
               {/* Card Decoration */}
               <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-3xl -mr-4 -mt-4 pointer-events-none" />
               
               <div className="flex justify-between items-start relative z-10">
                 <div className="flex items-start gap-3">
                   {/* Avatar/Thumbnail */}
                   <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      {entry.customerPhoto ? (
                        <img src={entry.customerPhoto} alt="C" className="w-full h-full object-cover" />
                      ) : (
                        <User size={20} className="text-gray-500" />
                      )}
                   </div>
                   
                   <div>
                     <h3 className="font-bold text-lg text-white leading-tight">
                       {entry.customerName || 'Unnamed Customer'}
                     </h3>
                     <div className="flex items-center text-emerald-400 text-xs mt-1 font-mono">
                       <Bike size={12} className="mr-1" />
                       {entry.bikeNumber || 'No Bike No.'}
                     </div>
                   </div>
                 </div>
               </div>
               
               <div className="mt-4 flex flex-wrap gap-2">
                  {entry.mobileNumber && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-gray-400 text-xs">
                      <Phone size={10} className="mr-1" /> {entry.mobileNumber}
                    </span>
                  )}
                  {entry.date && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-gray-400 text-xs">
                      <Calendar size={10} className="mr-1" /> {entry.date}
                    </span>
                  )}
               </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <div className="absolute bottom-6 right-6 z-20">
        <button 
          onClick={openNewEntryModal}
          className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white hover:scale-110 transition-transform active:scale-95"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteId && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden">
            {/* Background blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Record?</h3>
              <p className="text-gray-400 text-sm">
                This action cannot be undone. All data including photos will be permanently removed.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setDeleteId(null)} fullWidth>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete} fullWidth>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAIL VIEW MODAL --- */}
      {viewingEntry && !deleteId && (
        <div className="absolute inset-0 z-40 bg-[#09090b] flex flex-col animate-in fade-in slide-in-from-right-10 duration-200">
           {/* Header */}
           <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
            <button onClick={() => setViewingEntry(null)} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium">
              <ArrowLeft size={20} /> Back
            </button>
            <h3 className="text-lg font-bold text-white">Details</h3>
            <div className="w-12"></div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 pb-24">
             {/* Customer */}
             <SectionHeader icon={User} title="Customer" />
             <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-zinc-800 overflow-hidden border border-white/10 shrink-0">
                   {viewingEntry.customerPhoto ? (
                     <img src={viewingEntry.customerPhoto} className="w-full h-full object-cover" />
                   ) : <User className="w-full h-full p-4 text-gray-600" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{viewingEntry.customerName || 'N/A'}</h2>
                  <div className="text-emerald-400 font-mono text-sm">{viewingEntry.bikeNumber}</div>
                </div>
             </div>
             <DetailRow label="Father Name" value={viewingEntry.fatherName} />
             <DetailRow label="Mobile" value={viewingEntry.mobileNumber} />
             
             {/* Vehicle */}
             <SectionHeader icon={Bike} title="Vehicle" />
             <DetailPhotos label="Vehicle Photo" photos={viewingEntry.vehiclePhoto} single />
             <div className="grid grid-cols-2 gap-4">
               <DetailRow label="Bike Number" value={viewingEntry.bikeNumber} />
               <DetailRow label="Engine Number" value={viewingEntry.engineNumber} />
               <DetailRow label="Chassis Number" value={viewingEntry.chassisNumber} />
             </div>

             {/* Insurance */}
             {(viewingEntry.insuranceStart || viewingEntry.insuranceEnd || viewingEntry.thirdPartyStart) && (
               <>
                <SectionHeader icon={FileText} title="Insurance" />
                <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                  <DetailRow label="Insurance Start" value={viewingEntry.insuranceStart} />
                  <DetailRow label="Insurance End" value={viewingEntry.insuranceEnd} />
                  <DetailRow label="TP Start" value={viewingEntry.thirdPartyStart} />
                  <DetailRow label="TP End" value={viewingEntry.thirdPartyEnd} />
                </div>
               </>
             )}

             {/* KYC */}
             {viewingEntry.kycPhotos && viewingEntry.kycPhotos.length > 0 && (
               <>
                 <SectionHeader icon={FileText} title="KYC Documents" />
                 <DetailPhotos label="Documents" photos={viewingEntry.kycPhotos} />
               </>
             )}

             {/* Addresses */}
             {(viewingEntry.permanentAddress || viewingEntry.permanentPhotos?.length) && (
               <>
                 <SectionHeader icon={MapPin} title="Permanent Address" />
                 <DetailRow label="Address" value={viewingEntry.permanentAddress} />
                 <DetailRow label="Landmark" value={viewingEntry.permanentLandmark} />
                 <DetailPhotos label="Photos" photos={viewingEntry.permanentPhotos} />
               </>
             )}

             {(viewingEntry.correspondenceAddress || viewingEntry.correspondencePhotos?.length) && (
               <>
                 <SectionHeader icon={MapPin} title="Correspondence Address" />
                 <DetailRow label="Address" value={viewingEntry.correspondenceAddress} />
                 <DetailRow label="Landmark" value={viewingEntry.correspondenceLandmark} />
                 <DetailPhotos label="Photos" photos={viewingEntry.correspondencePhotos} />
               </>
             )}

             {(viewingEntry.bikeLocationAddress || viewingEntry.bikeLocationPhotos?.length) && (
               <>
                 <SectionHeader icon={MapPin} title="Bike Location" />
                 <DetailRow label="Address" value={viewingEntry.bikeLocationAddress} />
                 <DetailRow label="Landmark" value={viewingEntry.bikeLocationLandmark} />
                 <DetailPhotos label="Photos" photos={viewingEntry.bikeLocationPhotos} />
               </>
             )}

             <div className="h-8"></div>
          </div>

          {/* Action Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/10 flex gap-3 z-20">
            <Button variant="danger" onClick={() => initiateDelete(viewingEntry.id)} className="flex-1">
              <Trash2 size={18} className="mr-2" /> Delete
            </Button>
            <Button onClick={() => openEditModal(viewingEntry)} className="flex-[2]">
              <Edit2 size={18} className="mr-2" /> Edit Details
            </Button>
          </div>
        </div>
      )}

      {/* --- ADD/EDIT ENTRY MODAL --- */}
      {showModal && !deleteId && (
        <div className="absolute inset-0 z-50 bg-[#09090b] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-200">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
            <button onClick={closeFormModal} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium">
              <ChevronDown size={20} className="rotate-90" /> Back
            </button>
            <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Entry' : 'Add New Entry'}</h3>
            <div className="w-12"></div> {/* Spacer for centering */}
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto p-5 pb-24">
            <form id="entryForm" onSubmit={handleSubmit}>
              
              {/* 1. Customer Details */}
              <SectionHeader icon={User} title="Customer Details" />
              <InputField label="Customer Name *" value={formData.customerName} onChange={(v: string) => handleTextChange('customerName', v)} placeholder="e.g. Rahul Kumar" />
              <InputField label="Father's Name" value={formData.fatherName} onChange={(v: string) => handleTextChange('fatherName', v)} placeholder="Father's Name" />
              <InputField label="Mobile Number *" value={formData.mobileNumber} onChange={(v: string) => handleTextChange('mobileNumber', v)} placeholder="9876543210" type="tel" />
              <PhotoUpload label="Customer Photo" field="customerPhoto" />

              {/* 2. Vehicle Details */}
              <SectionHeader icon={Bike} title="Vehicle Details" />
              <InputField label="Bike Number *" value={formData.bikeNumber} onChange={(v: string) => handleTextChange('bikeNumber', v)} placeholder="MH 12 AB 1234" />
              <InputField label="Engine Number" value={formData.engineNumber} onChange={(v: string) => handleTextChange('engineNumber', v)} placeholder="Engine No." />
              <InputField label="Chassis Number" value={formData.chassisNumber} onChange={(v: string) => handleTextChange('chassisNumber', v)} placeholder="Chassis No." />
              <PhotoUpload label="Vehicle Photo" field="vehiclePhoto" />

              {/* 3. Insurance Details */}
              <SectionHeader icon={FileText} title="Insurance Details" />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Insurance Start" value={formData.insuranceStart} onChange={(v: string) => handleTextChange('insuranceStart', v)} type="date" />
                <InputField label="Insurance End" value={formData.insuranceEnd} onChange={(v: string) => handleTextChange('insuranceEnd', v)} type="date" />
                <InputField label="TP Start" value={formData.thirdPartyStart} onChange={(v: string) => handleTextChange('thirdPartyStart', v)} type="date" />
                <InputField label="TP End" value={formData.thirdPartyEnd} onChange={(v: string) => handleTextChange('thirdPartyEnd', v)} type="date" />
              </div>

              {/* 4. KYC Documents */}
              <SectionHeader icon={FileText} title="KYC Documents" />
              <p className="text-xs text-gray-500 mb-2 -mt-2">Upload Aadhaar, PAN, etc.</p>
              <PhotoUpload label="Upload KYC Photos" field="kycPhotos" isMultiple />

              {/* 5. Permanent Address */}
              <SectionHeader icon={MapPin} title="Permanent Address" />
              <TextAreaField label="Full Address *" value={formData.permanentAddress} onChange={(v: string) => handleTextChange('permanentAddress', v)} placeholder="House No, Street, City..." />
              <InputField label="Location / Landmark" value={formData.permanentLandmark} onChange={(v: string) => handleTextChange('permanentLandmark', v)} placeholder="Near..." />
              <PhotoUpload label="Upload Address Photos" field="permanentPhotos" isMultiple />

              {/* 6. Correspondence Address */}
              <SectionHeader icon={MapPin} title="Address of Correspondence" />
              <TextAreaField label="Full Address" value={formData.correspondenceAddress} onChange={(v: string) => handleTextChange('correspondenceAddress', v)} placeholder="House No, Street, City..." />
              <InputField label="Location / Landmark" value={formData.correspondenceLandmark} onChange={(v: string) => handleTextChange('correspondenceLandmark', v)} placeholder="Near..." />
              <PhotoUpload label="Upload Address Photos" field="correspondencePhotos" isMultiple />

              {/* 7. Bike Location */}
              <SectionHeader icon={MapPin} title="Bike Location" />
              <TextAreaField label="Full Address" value={formData.bikeLocationAddress} onChange={(v: string) => handleTextChange('bikeLocationAddress', v)} placeholder="Garage / Parking Address..." />
              <InputField label="Location / Landmark" value={formData.bikeLocationLandmark} onChange={(v: string) => handleTextChange('bikeLocationLandmark', v)} placeholder="Near..." />
              <PhotoUpload label="Upload Bike Loc. Photos" field="bikeLocationPhotos" isMultiple />

              <div className="h-8"></div> {/* Bottom Spacer */}
            </form>
          </div>

          {/* Sticky Footer Actions */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/10 flex gap-3 z-20">
            <Button variant="secondary" onClick={closeFormModal} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-[2]">
              <Save size={18} className="mr-2" /> {isEditing ? 'Update' : 'Save'} Entry
            </Button>
          </div>

        </div>
      )}
    </div>
  );
};