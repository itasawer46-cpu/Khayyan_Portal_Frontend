import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Directory() {
  const [marhoomeinData, setMarhoomeinData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWand, setSelectedWand] = useState("All");
  
  // Modals state management
  const [selectedMarhoom, setSelectedMarhoom] = useState(null); // Detail view ke liye
  const [editMarhoom, setEditMarhoom] = useState(null);         // Edit form ke liye
  
  // Check admin state from localStorage
  const [isAdmin, setIsAdmin] = useState(false);

  // Edit form inputs state
  const [editFormData, setEditFormData] = useState({
    name: '',
    fatherName: '',
    wand: '',
    dateOfDemise: '',
    dayOfWeek: ''
  });
  const [editImageFile, setEditImageFile] = useState(null);

  const location = useLocation();

  // API se Live Data Fetch karne ka logic
  const fetchMarhoomein = async () => {
    try {
      const response = await axios.get('https://khayyan-portal-backend.vercel.app/api/marhoomein/all');
      if (response.data.success) {
        setMarhoomeinData(response.data.data);
      }
    } catch (error) {
      console.error("Database se data lane me masla aaya:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarhoomein();
    // Check karein ke local storage me admin login hai ya nahi
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // URL query params listener
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQueryParams = queryParams.get('search');

    if (searchQueryParams) {
      setSearchTerm(searchQueryParams);
    }
  }, [location]);

  // REAL-TIME FILTER LOGIC
  const filteredMarhoomein = marhoomeinData.filter((person) => {
    const matchesSearch = 
      person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.wand?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesWand = selectedWand === "All" || person.wand === selectedWand;

    return matchesSearch && matchesWand;
  });

  // --- DELETE FUNCTION ---
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Card detail modal ko khulne se rokne ke liye
    
    if (window.confirm("⚠️ Kya aap waqai is record ko hamesha ke liye delete karna chahte hain? Is se tasveer bhi server se saaf ho jayegi.")) {
      try {
        const response = await axios.delete(`https://khayyan-portal-backend.vercel.app/api/marhoomein/delete/${id}`);
        if (response.data.success) {
          alert("🗑️ Record kamyabi se delete ho gaya!");
          fetchMarhoomein(); // UI refresh karne ke liye
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("❌ Error! Record delete nahi ho saka.");
      }
    }
  };

  // --- EDIT MODAL OPEN FUNCTION ---
  const handleEditClick = (person, e) => {
    e.stopPropagation(); // Card detail modal ko rokne ke liye
    setEditMarhoom(person);
    setEditFormData({
      name: person.name,
      fatherName: person.fatherName,
      wand: person.wand,
      dateOfDemise: person.dateOfDemise,
      dayOfWeek: person.dayOfWeek || ''
    });
    setEditImageFile(null); // File input reset
  };

  // --- EDIT INPUTS CHANGE HANDLER ---
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dateOfDemise') {
      if (value) {
        const selectedDate = new Date(value);
        const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(selectedDate);
        setEditFormData({ ...editFormData, dateOfDemise: value, dayOfWeek: dayName });
      } else {
        setEditFormData({ ...editFormData, dateOfDemise: value, dayOfWeek: '' });
      }
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  // --- UPDATE SUBMIT FUNCTION ---
  const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    data.append('name', editFormData.name);
    data.append('fatherName', editFormData.fatherName);
    data.append('wand', editFormData.wand);
    data.append('dateOfDemise', editFormData.dateOfDemise);
    data.append('dayOfWeek', editFormData.dayOfWeek);
    
    // Sirf tabhi append karein agar file select ki gayi ho
    if (editImageFile) {
      data.append('image', editImageFile);
    }

    const response = await axios.put(`https://khayyan-portal-backend.vercel.app/api/marhoomein/update/${editMarhoom._id}`, data);

    if (response.data.success) {
      alert("📝 Record kamyabi se update ho gaya!");
      setEditMarhoom(null);
      fetchMarhoomein();
    }
  } catch (error) {
    console.error("Update error:", error);
    alert("❌ Error! Update nahi ho saka.");
  }
};

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-slate-600 font-semibold mt-4 text-sm uppercase tracking-wide">Khayyan Portal Data Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 mt-16 min-h-screen">
      {/* Page Header */}
      <div className="border-l-4 border-emerald-600 pl-4 mb-10 text-left">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Marhoomein Directory
        </h1>
        <p className="text-lg text-emerald-600 font-bold mt-1">
          Gaoon Khayyan ke un tamam azeezon ki fehrist jo is duniya se rukhsaat farma gae hain.
        </p>
      </div>

      {/* Filter & Search Controls Row */}
      <div className="bg-white border-2 border-emerald-600 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center mb-8 hover:shadow-[5px_10px_20px_rgba(0,255,0,0.1)] hover:-translate-y-2 transition-all duration-300">
        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            value={searchTerm}
            placeholder="Marhoom ka Naam ya waldiyat talash karein..."
            className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-colors"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64 flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Gaoon Ka Hissa:</label>
          <select 
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-colors text-slate-700 font-medium"
            onChange={(e) => setSelectedWand(e.target.value)}
          >
            <option value="All">Poora Gaoon (All)</option>
            <option value="Landa Wali Wand">Landa Wali Wand</option>
            <option value="Charda Wali Wand">Charda Wali Wand</option>
            <option value="Daken Wali Wand">Daken Wali Wand</option>
            <option value="Perbat Wali Wand">Perbat Wali Wand</option>
          </select>
        </div>
      </div>

      {/* Directory Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        {filteredMarhoomein.map((person) => (
          <div
            onClick={() => setSelectedMarhoom(person)} 
            key={person._id} 
            className="bg-slate-300 border border-slate-200/70 p-6 rounded-2xl shadow-lg hover:shadow-md hover:shadow-[5px_10px_20px_rgba(0,255,0,0.1)] hover:border hover:bg-white hover:border-emerald-600 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Top Bar inside Card */}
              <div className="flex justify-between items-start mb-4">
               {/* Directory Grid Layout ke andar is part ko replace karein */}
{person.imageName && person.imageName !== "cover.jpg" ? (
  <img 
    src={person.imageName} 
    alt={person.name} 
    className="w-44 h-44 rounded-xl object-contain border border-slate-200"
    onError={(e) => {
      e.target.style.display = 'none';
      e.target.nextSibling.style.display = 'flex';
    }}
  />
) : null}

                {/* Fallback Icon */}
                {(!person.imageName || person.imageName === "cover.jpg") && (
                  <div className="w-24 h-24 bg-slate-100 text-slate-600 font-bold rounded-xl flex items-center justify-center text-3xl">
                    👤
                  </div>
                )} 

                <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  {person.wand}
                </span>
              </div>

              {/* Marhoom Details */}
              <h3 className="text-lg font-bold text-slate-800 mb-1">{person.name}</h3>
              <p className="text-sm text-slate-500 font-medium mb-4">Waldiyat: {person.fatherName}</p>
            </div>

            <div>
              {/* Date of Demise Section */}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm mb-3">
                <span className="text-slate-500 font-medium">Tareekh-e-Vafat:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {person.dateOfDemise} {person.dayOfWeek && <span className="text-[10px] font-normal text-slate-500">({person.dayOfWeek})</span>}
                </span>
              </div>

              {/* --- ADMIN ACTION BUTTONS --- */}
              {isAdmin && (
                <div className="flex gap-2 pt-2 border-t border-dashed border-slate-300">
                  <button 
                    onClick={(e) => handleEditClick(person, e)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    📝 Edit
                  </button>
                  <button 
                    onClick={(e) => handleDelete(person._id, e)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Screen */}
      {filteredMarhoomein.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-6">
          <p className="text-7xl">🔍</p>
          <p className="text-base font-bold text-slate-700 mt-3">Koi Record Nahi Mila</p>
          <p className="text-xs text-slate-400 mt-1">Sahi naam likhein ya check karein ke aapne sahi Wand select ki hai ya nahi.</p>
        </div>
      )}

      {/* --- IMAGE & DATA DETAIL MODAL --- */}
      {selectedMarhoom && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-300"
          onClick={() => setSelectedMarhoom(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedMarhoom(null)}
              className="absolute top-4 right-4 bg-slate-900/60 hover:bg-slate-900 text-white font-bold w-9 h-9 rounded-full flex items-center justify-center text-sm z-10 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 bg-slate-100 flex items-center justify-center h-64 md:h-auto min-h-[320px] relative">
              {/* Image Detail Modal ke andar is part ko replace karein */}
{selectedMarhoom.imageName && selectedMarhoom.imageName !== "cover.jpg" ? (
  <img 
    src={selectedMarhoom.imageName} 
    alt={selectedMarhoom.name} 
    className="w-full h-full object-contain absolute inset-0"
  />
) : (
  <div className="absolute inset-0 bg-slate-200 text-slate-400 flex items-center justify-center text-7xl">👤</div>
)}
            </div>

            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-white to-slate-50 text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-3">
                  {selectedMarhoom.wand}
                </span>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{selectedMarhoom.name}</h3>
                <p className="text-md text-slate-500 font-medium mt-1">Waldiyat: <span className="text-slate-800 font-bold">{selectedMarhoom.fatherName}</span></p>
              </div>
              <hr className="my-6 border-slate-200" />
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tareekh-e-Wafat</p>
                <p className="text-md font-bold text-slate-800 flex items-center gap-1.5">📅 {selectedMarhoom.dateOfDemise}</p>
                {selectedMarhoom.dayOfWeek && (
                  <p className="text-xs font-semibold text-emerald-700 mt-2 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-100">🗓️ Din: {selectedMarhoom.dayOfWeek}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- LIVE EDIT FORM POPUP MODAL --- */}
      {editMarhoom && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-left border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setEditMarhoom(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-bold text-slate-900 mb-1">📝 Record Tabdeel Karein</h2>
            <p className="text-xs text-slate-400 mb-6">Yahan se aap kisi bhi data ko theek ya tasveer badal sakte hain.</p>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Marhoom ka Naam</label>
                <input 
                  type="text" name="name" required value={editFormData.name} onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Waldiyat</label>
                <input 
                  type="text" name="fatherName" required value={editFormData.fatherName} onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gaoon ka Hissa (Wand)</label>
                <select 
                  name="wand" value={editFormData.wand} onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                >
                  <option value="Landa Wali Wand">Landa Wali Wand</option>
                  <option value="Charda Wali Wand">Charda Wali Wand</option>
                  <option value="Daken Wali Wand">Daken Wali Wand</option>
                  <option value="Perbat Wali Wand">Perbat Wali Wand</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tareekh-e-Wafat</label>
                <input 
                  type="date" name="dateOfDemise" required value={editFormData.dateOfDemise} onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
                {editFormData.dayOfWeek && (
                  <p className="mt-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block border border-emerald-100">🗓️ Din: {editFormData.dayOfWeek}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nayi Tasveer (Optional)</label>
                <input 
                  type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-1">Agar photo nahi badalni to isko khali chor dein.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" onClick={() => setEditMarhoom(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer text-center"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Directory;