import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const AdminDashboard = () => {
  // --- EXISTING STATE FOR MARHOOM FORM ---
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    wand: 'Landa Wali Wand', 
    dateOfDemise: '',
    dayOfWeek: '', 
  });
  const [imageFile, setImageFile] = useState(null);

  // --- STATE FOR KHABARNAMA ---
  const [announcement, setAnnouncement] = useState({
    type: 'Vafat', 
    title: '',
    date: '',      
    details: ''
  });
  const [announcementMsg, setAnnouncementMsg] = useState({ text: '', isError: false });
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  
  // --- EXISTING TRACKS FOR IMAGES & EDITS ---
  const [announcementImageFile, setAnnouncementImageFile] = useState(null); 
  const [editId, setEditId] = useState(null); 

  // --- 🔥 Voice note track karne ke liye ---
  const [announcementAudioFile, setAnnouncementAudioFile] = useState(null);

  // --- PORTAL COUNTER STATS FOR RIGHT SIDE BOX ---
  const [familiesInput, setFamiliesInput] = useState("");
  const [shajraInput, setShajraInput] = useState("");
  const [statsMessage, setStatsMessage] = useState("");
  const [statsLoading, setStatsLoading] = useState(false);

  // --- EFFECT: Load Current Stats & Announcements ---
  useEffect(() => {
    loadCurrentStats();
    fetchAnnouncements();
  }, []);

  // 🔥 ROUTE FIX: Changed to correct stats endpoint structure
  const loadCurrentStats = async () => {
    try {
      const response = await axios.get('https://khayyan-portal-backend.vercel.app/api/marhoomein/stats/all');
      const statsData = response.data.data || response.data;
      if (statsData) {
        setFamiliesInput(statsData.familiesCount || "120+");
        setShajraInput(statsData.shajraCount || "50+");
      }
    } catch (error) {
      console.error("Dashboard par stats load karne mein error:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('https://khayyan-portal-backend.vercel.app/api/announcements/all');
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setAllAnnouncements(data);
      } else if (response.data.success && Array.isArray(response.data.data)) {
        setAllAnnouncements(response.data.data);
      }
    } catch (error) {
      console.error("Announcements fetch karne mein error:", error);
    }
  };

  // --- HANDLER FOR MARHOOM FORM INPUT CHANGE ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dateOfDemise') {
      if (value) {
        const selectedDate = new Date(value);
        const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(selectedDate);
        
        setFormData({
          ...formData,
          dateOfDemise: value,
          dayOfWeek: dayName
        });
      } else {
        setFormData({ ...formData, dateOfDemise: value, dayOfWeek: '' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAnnouncementFileChange = (e) => {
    if (e.target.files[0]) {
      setAnnouncementImageFile(e.target.files[0]);
    }
  };

  const handleAnnouncementAudioChange = (e) => {
    if (e.target.files[0]) {
      setAnnouncementAudioFile(e.target.files[0]);
    }
  };

  // --- SUBMIT FOR MARHOOM RECORD ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('fatherName', formData.fatherName);
      data.append('wand', formData.wand);
      data.append('dateOfDemise', formData.dateOfDemise);
      data.append('dayOfWeek', formData.dayOfWeek);
      
      if (imageFile) {
        data.append('image', imageFile); 
      }

      const response = await axios.post('https://khayyan-portal-backend.vercel.app/api/marhoomein/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200 || response.status === 201 || response.data.success) {
        alert(`✨ Record Successfully Database Me Shamil Ho Gya! ✨`);
        setFormData({ name: '', fatherName: '', wand: 'Landa Wali Wand', dateOfDemise: '', dayOfWeek: '' });
        setImageFile(null);
        const fileInput = document.getElementById('imageFileInput');
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
      alert("❌ Record add karne mein backend par koi masla aaya hai.");
    }
  };

  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setAnnouncement({ ...announcement, date: value });
    } else {
      setAnnouncement({ ...announcement, [name]: value });
    }
  };

  // --- SUBMIT FOR KHABARNAMA FORM ---
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('type', announcement.type);
    data.append('title', announcement.title);
    data.append('date', announcement.date);
    data.append('details', announcement.details);
    
    if (announcementImageFile) data.append('image', announcementImageFile);
    if (announcementAudioFile) data.append('audio', announcementAudioFile);

    try {
      if (editId) {
        const response = await axios.put(`https://khayyan-portal-backend.vercel.app/api/announcements/update/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success || response.status === 200) {
          setAnnouncementMsg({ text: 'Khabarnama kamyabi se update ho gaya! 🎉', isError: false });
          resetAnnouncementForm();
          fetchAnnouncements();
          setTimeout(() => setAnnouncementMsg({ text: '', isError: false }), 4000);
        }
      } else {
        const response = await axios.post('https://khayyan-portal-backend.vercel.app/api/announcements/add', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success || response.status === 201 || response.status === 200) {
          setAnnouncementMsg({ text: 'Khabarnama perfectly publish ho gaya! 🎉', isError: false });
          resetAnnouncementForm();
          fetchAnnouncements();
          setTimeout(() => setAnnouncementMsg({ text: '', isError: false }), 4000);
        }
      }
    } catch (error) {
      setAnnouncementMsg({ text: 'Save karne mein koi masla aya hai! ❌', isError: true });
    }
  };

  const resetAnnouncementForm = () => {
    setAnnouncement({ type: 'Vafat', title: '', date: '', details: '' });
    setAnnouncementImageFile(null);
    setAnnouncementAudioFile(null);
    setEditId(null); 
    const aFileInput = document.getElementById('announcementImageInput');
    if (aFileInput) aFileInput.value = '';
    const aAudioInput = document.getElementById('announcementAudioInput');
    if (aAudioInput) aAudioInput.value = '';
  };

  const handleEditClick = (item) => {
    setEditId(item._id);
    const rawDate = item.date ? item.date.split(' ')[0] : '';
    setAnnouncement({ type: item.type, title: item.title, date: rawDate, details: item.details });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };
 
  const handleCancelEdit = () => { resetAnnouncementForm(); };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm("Kya aap waqai is khabarnama ko delete karna chahte hain?")) {
      try {
        const response = await axios.delete(`https://khayyan-portal-backend.vercel.app/api/announcements/delete/${id}`);
        if (response.data.success || response.status === 200) {
          alert("🗑️ Khabarnama kamyabi se delete ho gaya!");
          if (editId === id) handleCancelEdit(); 
          fetchAnnouncements();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 🔥 FIXED SYNTAX HERE: Removed the accidental colon
  const handleStatsUpdate = async (e) => {
    e.preventDefault();
    setStatsLoading(true);
    setStatsMessage("");
    try {
      const response = await axios.put('https://khayyan-portal-backend.vercel.app/api/marhoomein/stats/update', {
        familiesCount: familiesInput,
        shajraCount: shajraInput
      });
      if (response.data.success || response.status === 200) {
        setStatsMessage("Portal stats kamyabi se update ho gaye hain! ✅");
        setTimeout(() => setStatsMessage(""), 4000); 
      }
    } catch (error) {
      setStatsMessage("Stats update karne mein koi masla aaya hai. ❌");
    } finally {
      setStatsLoading(false);
    }
  };
  return (
    <div className="min-h-[90vh] bg-gray-50 py-12 px-4 max-w-6xl mx-auto mt-20">
      
      {/* Upper Welcoming Header */}
      <div className="border-l-4 border-emerald-600 pl-4 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-sm font-semibold text-emerald-600 mt-1">
          Naye Marhoomein ka indraj karein aur portal counters ko control karein.
        </p>
      </div>

      {/* Main Grid: Left side for Forms, Right side for Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* --- LEFT HAND SIDE: FORMS & LIST SECTION --- */}
        <div className="lg:col-span-2 space-y-8 w-full">
          
          {/* 1. MARHOOM RECORD FORM */}
          <div className="border border-gray-300 bg-slate-200 p-6 md:p-8 rounded-2xl shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-emerald-800 tracking-tight">👤 Naye Marhoom Ka Record</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Zaroori maloomat fill kar ke database mein record shamil karein.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marhoom ka Naam</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 bg-white py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-none transition-all"
                    placeholder="Naam darj karein"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waldiyat (Father's Name)</label>
                  <input
                    type="text"
                    name="fatherName"
                    required
                    value={formData.fatherName}
                    onChange={handleChange}
                    className="w-full bg-white px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-none transition-all"
                    placeholder="Waldiyat darj karein"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gaoon ka Hissa (Wand)</label>
                  <select
                    name="wand"
                    value={formData.wand}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm bg-white focus:outline-none transition-all"
                  >
                    <option value="Landa Wali Wand">Landa Wali Wand</option>
                    <option value="Charda Wali Wand">Charda Wali Wand</option>
                    <option value="Daken Wali Wand">Daken Wali Wand</option>
                    <option value="Perbat Wali Wand">Perbat Wali Wand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tareekh-e-Wafat</label>
                  <input
                    type="date"
                    name="dateOfDemise"
                    required
                    value={formData.dateOfDemise}
                    onChange={handleChange}
                    className="w-full bg-white px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-none transition-all"
                  />
                  {formData.dayOfWeek && (
                    <p className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                      🗓️ Din: {formData.dayOfWeek}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marhoom ki Tasveer Select Karein</label>
                <input
                  id="imageFileInput"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm cursor-pointer"
                >
                  Record Shamil Karein
                </button>
              </div>
            </form>
          </div>

          {/* 2. KHABARNAMA FORM */}
          <div className={`border p-6 md:p-8 rounded-2xl shadow-md transition-all duration-300 ${editId ? 'border-amber-400 bg-amber-50/40' : 'border-gray-300 bg-white'}`}>
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {editId ? '✏️ Edit Mode: Khabarnama Tarseem' : '📢 Naya Khabarnama Add Karein'}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {editId ? 'Is elaan ki maloomat ko tabdeel kar ke niche diye gaye button se save karein.' : 'Gaoon ke portal par live notification aur audio voice announcement chalane ke liye.'}
                </p>
              </div>
              {editId && (
                <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 animate-pulse">
                  Editing Active
                </span>
              )}
            </div>

            {announcementMsg.text && (
              <div className={`p-3 rounded-xl text-xs font-bold mb-4 ${!announcementMsg.isError ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {announcementMsg.text}
              </div>
            )}

            <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Elaan ki Kism (Type)</label>
                  <select
                    name="type"
                    value={announcement.type}
                    onChange={handleAnnouncementChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm bg-white focus:outline-none transition-all"
                  >
                    <option value="Vafat">Vafat</option>
                    <option value="Soyem / Qul">Soyem / Qul</option>
                    <option value="Elaan">Aam Elaan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tareekh Select Karein 📅</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={announcement.date}
                    onChange={handleAnnouncementChange}
                    className="w-full bg-white px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Elaan ki Heading / Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={announcement.title}
                  onChange={handleAnnouncementChange}
                  placeholder="e.g., Chaudhary Muhammad Aslam Sahab Vafat Pa Gae Hain"
                  className="w-full bg-white px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mukammal Tafseelat (Details)</label>
                <input
                  type="text"
                  name="details"
                  required
                  value={announcement.details}
                  onChange={handleAnnouncementChange}
                  placeholder="e.g., Namaz-e-Janaza: Aaj baad namaz-e-Asar (5:30 PM) Markazi Janazagah mein hogi."
                  className="w-full bg-white px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marhoom ki Pic Upload Karein {announcement.type === 'Vafat' ? '(Zaroori)' : '(Optional)'}</label>
                <input
                  id="announcementImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleAnnouncementFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer transition-all"
                />
              </div>

              {/* AUDIO UPLOAD FIELD */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 font-semibold flex items-center gap-1">
                  🎤 Voice Announcement / Audio Upload <span className="text-xs font-normal text-slate-400">(Optional - MP3, WAV, M4A)</span>
                </label>
                <input
                  id="announcementAudioInput"
                  type="file"
                  accept="audio/*"
                  onChange={handleAnnouncementAudioChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-all"
                />
              </div>

              <div className="flex gap-4 pt-2">
                {editId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl transition duration-200 text-sm cursor-pointer border border-gray-300"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  className={`font-medium py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm cursor-pointer ${editId ? 'w-2/3 bg-amber-600 hover:bg-amber-700 text-white' : 'w-full bg-emerald-700 hover:bg-emerald-800 text-white'}`}
                >
                  {editId ? 'Update Announcement 💾' : 'Publish Announcement 🚀'}
                </button>
              </div>
            </form>
          </div>

          {/* 3. MANAGE KHABARNAMA LIST */}
          <div className="border border-gray-300 bg-white p-6 md:p-8 rounded-2xl shadow-md">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-950 tracking-tight">🛠️ Active Khabarnama List ({allAnnouncements.length})</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Galti se add kiye gaye elaanat ko yahan se edit ya delete karein.</p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto pr-2 space-y-2">
              {allAnnouncements.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">Koi active khabarnama nahi hai.</p>
              ) : (
                allAnnouncements.map((item) => (
                  <div key={item._id} className="flex justify-between items-center py-3 pl-2 hover:bg-slate-50 rounded-xl transition-all">
                    <div className="pr-4 max-w-[70%]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 border text-slate-700">
                          {item.type}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                        {item.audio && <span className="text-xs" title="Audio included">🎤</span>}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 mt-1 line-clamp-1">{item.title}</h4>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-700 p-2 rounded-xl transition-all cursor-pointer border border-amber-200 active:scale-95 text-xs font-bold"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(item._id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-all cursor-pointer border border-red-200 active:scale-95 text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* --- RIGHT HAND SIDE: PORTAL STATS CUSTOMIZER BOX --- */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-300 h-fit lg:sticky lg:top-24">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">📊 Live Counter Stats</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Home page par dikhne wale dynamic numbers badlein.</p>
          </div>

          {statsMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold mb-4 ${statsMessage.includes('✅') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {statsMessage}
            </div>
          )}

          <form onSubmit={handleStatsUpdate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Khandan / Families Ginti</label>
              <input 
                type="text" 
                value={familiesInput} 
                onChange={(e) => setFamiliesInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 font-semibold text-slate-800 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Shajra-e-Nasab Ginti</label>
              <input 
                type="text" 
                value={shajraInput} 
                onChange={(e) => setShajraInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 font-semibold text-slate-800 transition-all"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={statsLoading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all duration-300 shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {statsLoading ? "Saving Changes..." : "Save Dashboard Stats"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;