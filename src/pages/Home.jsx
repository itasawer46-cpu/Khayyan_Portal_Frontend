import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

function Home() {
  // 1. Gaoon ki pics ka array
  const images = [
    "Khayyan.jpg", 
    "https://images.unsplash.com/photo-1711447886733-5ebccb82ec66?w=500&auto=format&fit=crop&q=60", 
    "https://images.unsplash.com/photo-1648102796336-0a5f2c417770?w=500&auto=format&fit=crop&q=60", 
    "https://images.unsplash.com/photo-1651678938586-affccc71c270?w=500&auto=format&fit=crop&q=60", 
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60", 
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=60", 
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60"  
  ];

  // State Management
  const [currentIndex, setCurrentIndex] = useState(0);
  const [homeSearch, setHomeSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0); 
  const [families, setFamilies] = useState("120+");
  const [shajra, setShajra] = useState("50+");
  const [updatesData, setUpdatesData] = useState([]);

  // Extraordinary Modal States
  const [activeModal, setActiveModal] = useState(null); // 'dev' | 'provider' | null

  const navigate = useNavigate();

  // useEffect mein backend se live data hits handle ho rahe hain
  useEffect(() => {
    const fetchLiveCount = async () => {
      try {
        const response = await axios.get('http://khayyan-portal-backend.vercel.app/api/marhoomein/all');
        if (response.data.success) {
          setTotalRecords(response.data.data.length);
        }
      } catch (error) {
        console.error("Live records count load karne mein error:", error);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/marhoomein/stats/all');
        if (response.data.success && response.data.data) {
          setFamilies(response.data.data.familiesCount);
          setShajra(response.data.data.shajraCount);
        }
      } catch (err) {
        console.log("Stats fetch karne me error", err);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/announcements/all');
        if (response.data.success) {
          setUpdatesData(response.data.data);
        }
      } catch (error) {
        console.error("Khabarnama fetch karne mein error:", error);
      }
    };

    fetchLiveCount();
    fetchStats();
    fetchAnnouncements();
  }, []); 

  // Slider Functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (homeSearch.trim() !== "") {
      navigate(`/directory?search=${encodeURIComponent(homeSearch)}`);
    } else {
      navigate('/directory');
    }
  };

  // Helper function for dynamic badge styling based on announcement type
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'Vafat':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Soyem / Qul':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-center mt-16 relative">
      {/* Upper Hero Section */}
      <div className="space-y-3 mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 shadow-sm rounded-full border border-emerald-200 hover:shadow-xl hover:border hover:border-emerald-700 transition-all duration-300">
          Digital Memorial Record
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
          Khayyan Memorial Portal
        </h1>
        <p className="text-lg text-emerald-600 font-bold max-w-xl mx-auto leading-relaxed">
          Gaoon Khayyan ke marhoomein ke mukammal shajra-e-nasab aur tauseeqi record ka digital platform.
        </p>
      </div>

      {/* MODERN SEARCH BAR SECTION */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border-2 border-emerald-600 rounded-full overflow-hidden p-1.5 focus-within:border-green-600 focus-within:shadow-[0_4px_25px_rgba(34,197,94,0.15)] transition-all duration-300 w-full max-w-xl mx-auto mb-12 px-4 hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] hover:-translate-y-2">
        <div className="pl-4 text-gray-400 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.603Z" />
          </svg>
        </div>
        <input
          onChange={(e)=>setHomeSearch(e.target.value)} 
          type="text" 
          placeholder="Marhoom ka naam ya gaoon ka sector talash karein..." 
          className="w-full pl-3 pr-4 py-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm md:text-base"
        />
        <button 
          type="submit" 
          className="bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-full text-sm md:text-base shadow-md shadow-green-700/20 whitespace-nowrap active:scale-90 transition-all duration-300"
        >
          Search
        </button>
      </form>

      {/* --- IMAGE CAROUSEL SLIDER --- */}
      <div className="relative w-full max-w-7xl h-64 md:h-96 mx-auto mb-12 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-200 group bg-slate-100">
        <img 
          src={images[currentIndex]} 
          alt={`Khayyan Gaoon Pic ${currentIndex + 1}`} 
          className="w-full h-full object-contain transition-all duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
        <div className="absolute top-4 right-4 bg-slate-900/70 text-white text-xs px-2.5 py-1 rounded-full font-medium">
          {currentIndex + 1} / {images.length}
        </div>
        <button 
          onClick={prevSlide}
          type="button"
          className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 font-bold shadow-md flex items-center justify-center active:scale-90 cursor-pointer select-none transition-all duration-200"
          aria-label="Previous Image"
        >
          ❮
        </button>
        <button 
          onClick={nextSlide}
          type="button"
          className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 font-bold shadow-md flex items-center justify-center transition-all active:scale-90 cursor-pointer select-none transition-all duration-200"
          aria-label="Next Image"
        >
          ❯
        </button>
      </div>

      {/* --- COUNTER BOXES SECTION --- */}
      <div className='max-w-4xl mx-auto mt-16 mb-12 p-4 w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          <div className='bg-slate-300 p-6 group flex flex-col justify-center items-center rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] '>
            <div className='w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-700 mb-3 group-hover:text-white group-hover:bg-green-400 transition-all duration-300'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5H18a2.25 2.25 0 0 0 2.25-2.25V14.135m-7.5-11.25 7.5 7.5m-7.5-7.5v7.5m0-7.5A2.25 2.25 0 0 0 10.5 3.75H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.365V3.75m0 0a2.25 2.25 0 0 0-2.25-2.25H4.5m0 0A2.25 2.25 0 0 0 2.25 4.5v12c0 1.242 1.008 2.25 2.25 2.25h15" />
              </svg>
            </div>
            <div>
              <span className='text-3xl font-extrabold text-gray-900 tracking-tight block'>{totalRecords}</span>
              <span className='text-sm font-medium text-gray-500 mt-1'>Total Records</span>
            </div>
          </div>

          <div className='bg-slate-300 p-6 group flex flex-col justify-center items-center rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] '>
            <div className='w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-700 mb-3 group-hover:text-white group-hover:bg-green-400 transition-all duration-300'>
              <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <div>
              <span className='text-3xl font-extrabold text-gray-900 tracking-tight block'>{families}</span>
              <span className='text-sm font-medium text-gray-500 mt-1'>Khandan / Families</span>
            </div>
          </div>

          <div className='bg-slate-300 p-6 group flex flex-col justify-center items-center rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] '>
            <div className='w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-700 mb-3 group-hover:text-white group-hover:bg-green-400 transition-all duration-300'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
              </svg>
            </div>
            <div>
              <span className='text-3xl font-extrabold text-gray-900 tracking-tight block'>{shajra}</span>
              <span className='text-sm font-medium text-gray-500 mt-1'>Shajra-e-Nasab</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link to="/directory" className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] transition-all text-left block hover:border-emerald-600 hover:scale-105 duration-300">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all mb-4">
            📁
          </div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-1">
            Marhoomein Directory
          </h3>
          <p className="text-sm font-semibold text-slate-500">
            Saare marhoomein ki list, un ka sunehri daur, aur shajra dekhne ke liye yahan click karein.
          </p>
        </Link>

        <Link to="/admin" className="group p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-emerald-600 transition-all text-left block hover:scale-105 hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] duration-300">
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center text-xl font-bold group-hover:bg-slate-900 group-hover:text-white transition-all mb-4">
            🔒
          </div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-900 transition-colors mb-1">
            Management Portal
          </h3>
          <p className="text-sm font-semibold text-slate-500">
            Sirf authorized admins ke liye naya record mahfooz karne ya data entry karne ki jagah.
          </p>
        </Link>
      </div>

      {/* DYNAMIC KHABARNAMA / NEW UPDATE SECTION */}
      <div className="max-w-4xl mx-auto mt-20 text-left px-4">
        <div className="border-l-4 border-emerald-600 pl-4 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Khabarnama & Nayi Updates
          </h2>
          <p className="text-lg capitalize text-emerald-600 font-bold mt-1">
            Gaoon Khayyan ke haaleeya elanaat, vafat aur zaroori updates.
          </p>
        </div>

        {updatesData.length === 0 ? (
          <div className="text-center py-8 text-sm font-semibold text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            Filhal koi naya elaan ya update mojood nahi hai.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {updatesData.map((item) => (
              <div 
                key={item._id || item.id} 
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] hover:border hover:border-emerald-600 hover:-translate-y-2 transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${item.badgeClass || getBadgeStyle(item.type)}`}>
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {item.date}
                    </span>
                  </div>

                  {item.image && (
                    <div className="w-56 h-56 overflow-hidden rounded-xl mb-4 border border-slate-100 bg-slate-50 mx-auto">
                      <img 
                        src={`http://localhost:5000${item.image}`} 
                        alt="Marhoom" 
                        className="w-full h-full object-contain bg-gray-100 rounded-lg"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  <h3 className="text-base font-bold text-slate-800 leading-snug mb-3 text-center md:text-left">
                    {item.title}
                  </h3>
                </div>

                <div>
                  <div className="pt-3 border-t border-slate-100 text-sm text-emerald-600 bg-slate-50 p-3 rounded-xl font-semibold">
                    {item.details}
                  </div>

                  {/* 🔥 NEW DETECTED AUDIO FEATURE: Play voice note right inside the card */}
                  {item.audio && (
                    <div className="mt-4 p-2 bg-slate-100/80 border border-slate-200 rounded-xl shadow-inner">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1 px-1">
                        📢 Awaaz Sunien / Voice Announcement:
                      </span>
                      <audio 
                        src={`http://localhost:5000${item.audio}`} 
                        controls 
                        className="w-full h-8 accent-emerald-600 rounded-lg focus:outline-none"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* IMPORTANT CONTACTS SECTION */}
      <div className="max-w-4xl mx-auto mt-16 text-left px-4">
        <div className="border-l-4 border-emerald-600 pl-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gaoon ke Zaroori Numbers
          </h2>
          <p className="text-sm capitalize text-emerald-600 font-bold">
            Kisi bhi emergency ya rabte ke liye zaroori numbarat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a 
            href="tel:+923001234567"
            className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] hover:border hover:border-emerald-600 hover:-translate-y-2 transition-all duration-300 block cursor-pointer active:scale-95"
          >
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-base">
              📞
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Qabristan Committee</p>
              <p className="text-xs text-slate-500 font-medium">+92 300 1234567</p>
            </div>
          </a>

          <a 
            href="tel:+923127654321"
            className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] hover:border hover:border-emerald-600 hover:-translate-y-2 transition-all duration-300 block cursor-pointer active:scale-95" 
          >
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-base">
              🕌
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Imam Markazi Masjid</p>
              <p className="text-xs text-slate-500 font-medium">+92 312 7654321</p>
            </div>
          </a>

          <a 
            href="tel:+923450001122"
            className="bg-white border border-slate-200/60 p-4 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-[5px_10px_20px_rgba(0,255,0,0.4)] hover:border hover:border-emerald-600 hover:-translate-y-2 transition-all duration-300 block cursor-pointer active:scale-95"
          >
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-base">
              🚑
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Gaoon Ambulance</p>
              <p className="text-xs text-slate-500 font-medium">+92 345 0001122</p>
            </div>
          </a>
        </div>
      </div>
      {/* 🔥 PERMANENT QABRISTAN MAP SECTION */}
<div className="max-w-4xl mx-auto mt-16 text-left px-4">
  <div className="border-l-4 border-emerald-600 pl-4 mb-6">
    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
      📍 Gaoon Qabristan Location
    </h2>
    <p className="text-sm capitalize text-emerald-600 font-bold">
      Janaze ya Dua-e-Maghfirat ke liye rasta dhoondne mein aasani ke liye live map link.
    </p>
  </div>

  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-[5px_10px_25px_rgba(16,185,129,0.2)] transition-all duration-300">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-white text-emerald-600 shadow-sm border border-emerald-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
        🗺️
      </div>
      <div>
        <h4 className="text-base font-bold text-slate-900">Main Khayyan Qabristan Route</h4>
        <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">
          Baahir ke shehron ya door se aane wale azeez o aqarib is permanent Google Maps button ke zariye seedha qabristan ki exact pin location par pohanch sakte hain.
        </p>
      </div>
    </div>
    
    {/* 👇 "https://maps.google.com/..." ki jagah apna exact link laga dena */}
    <a 
      href="https://www.google.com/maps/place/Khayyan,+Pakistan/@32.4629074,73.8216942,91m/data=!3m1!1e3!4m6!3m5!1s0x391f6b5b7d300fe7:0xa929661e8f03c614!8m2!3d32.4615143!4d73.8257325!16s%2Fg%2F1tklnyk5!5m1!1e2?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D" 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full md:w-auto text-center shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-emerald-600/10 active:scale-95 hover:shadow-lg transition-all duration-200"
    >
      Open in Google Maps
    </a>
  </div>
</div>

      {/* ================= CONTRIBUTORS SECTION ================= */}
      <div className="max-w-4xl mx-auto mt-20 text-left px-4">
        <div className="border-l-4 border-emerald-600 pl-4 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            App Contributors
          </h2>
          <p className="text-lg capitalize text-emerald-600 font-bold mt-1">
            Is platform ko banane aur data faraham karne wale ahem afrad.
          </p>
        </div>
        
        <div className="flex justify-center gap-10 flex-wrap px-4">
          {/* Developer Card */}
          <div 
            onClick={() => setActiveModal('dev')} 
            className="group relative bg-slate-300 p-8 rounded-2xl shadow-sm w-72 cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:shadow-blue-100 hover:border-blue-600 hover:border-1"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl"></div>
            <div className="relative z-10 text-center">
              <div className="w-36 h-36 rounded-full mx-auto mb-6 p-1 bg-gradient-to-tr from-blue-500 to-indigo-500 transition-transform duration-300 group-hover:scale-105">
                <img src="/Husnain.jpg" alt="Muhammad Husnain" className="w-full h-full rounded-full object-cover border-2 border-white transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-blue-600">Muhammad Husnain</h3>
              <p className="text-sm font-bold text-blue-500 uppercase tracking-wider mt-1">Lead Developer</p>
              <span className="inline-block mt-4 text-sm font-bold text-slate-600 group-hover:text-blue-500 transition-colors duration-300">View Bio &rarr;</span>
            </div>
          </div>

          {/* Data Provider Card */}
          <div 
            onClick={() => setActiveModal('provider')} 
            className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 w-72 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-100 hover:border-emerald-400"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-xl"></div>
            <div className="relative z-10 text-center">
              <div className="w-36 h-36 rounded-full mx-auto mb-6 p-1 bg-gradient-to-tr from-emerald-500 to-teal-500 transition-transform duration-500 group-hover:scale-105">
                <img src="/Zohaib.jpg" alt="Contributor" className="w-full h-full rounded-full object-cover border-2 border-white transition-transform duration-500 group-hover:scale-105" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 transition-colors duration-300 group-hover:text-emerald-600">Zohaib Warraich</h3>
              <p className="text-sm font-bold text-emerald-500 uppercase tracking-wider mt-1">Data & Records Provider</p>
              <span className="inline-block mt-4 text-sm font-bold text-black group-hover:text-emerald-600 transition-colors duration-300">View Bio &rarr;</span>
            </div>
          </div>
        </div>
      </div>

      {/* DEVELOPER MODAL */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${activeModal === 'dev' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setActiveModal(null)}
      >
        <div 
          className={`bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative transform transition-transform duration-300 overflow-hidden ${activeModal === 'dev' ? 'scale-100' : 'scale-90'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="flex flex-col md:flex-row min-h-[350px]">
            <div className="w-full md:w-2/5 bg-slate-50 relative min-h-[250px] md:min-h-full">
              <img src="/Husnain.jpg" alt="Muhammad Husnain" className="w-full h-full object-cover absolute inset-0" />
            </div>
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Developer Profile
                </span>
                <h3 className="text-3xl font-extrabold text-gray-950 mt-3 tracking-tight">Muhammad Husnain</h3>
                <p className="text-sm font-semibold text-blue-600 mt-1">Software Engineering Student (UOG)</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mt-5 border-t border-slate-100 pt-4 font-medium">
                Main ne is platform ka poora architecture aur user interface design kiya hai taaki marhoomein ka record mahfooz rakhna aur dhoondna sab ke liye aasan aur responsive ho.
              </p>
              <div className="flex gap-6 mt-6 pt-2">
                <a href="#" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">🌐 GitHub</a>
                <a href="#" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">💼 LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DATA PROVIDER MODAL */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${activeModal === 'provider' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setActiveModal(null)}
      >
        <div 
          className={`bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative transform transition-transform duration-300 overflow-hidden ${activeModal === 'provider' ? 'scale-100' : 'scale-90'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div className="flex flex-col md:flex-row min-h-[350px]">
            <div className="w-full md:w-2/5 bg-slate-50 relative min-h-[250px] md:min-h-full">
              <img src="/Zohaib.jpg" alt="Contributor" className="w-full h-full object-cover absolute inset-0" />
            </div>
            <div className="w-full md:w-3/5 p-8 flex flex-col justify-center text-left">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  Records Contributor
                </span>
                <h3 className="text-3xl font-extrabold text-gray-950 mt-3 tracking-tight">Zohaib Ahmed</h3>
                <p className="text-sm font-semibold text-emerald-600 mt-1">Core Records Contributor</p>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mt-5 border-t border-slate-100 pt-4 font-medium">
                Unhon ne is neik maqsad me marhoomein ki darust maloomat aur details ikatha karne me ahem kirdar ada kiya hai, taaki data har tarah se authentic aur mukammal ho.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WAVY DIVIDER LINE */}
      <div className="w-full my-12 left-0 right-0 px-2 overflow-hidden">
        <svg 
          viewBox="0 0 1200 20" 
          className="w-full h-6 drop-shadow-[0_2px_8px_rgba(16,185,129,0.25)]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="fullWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
          <path 
            d="M 0,10 C 150,0 150,20 300,10 C 450,0 450,20 600,10 C 750,0 750,20 900,10 C 1050,0 1050,20 1200,10" 
            fill="none" 
            stroke="url(#fullWaveGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>
      
      <p className="mt-12 text-lg text-emerald-600 font-bold">
        كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ: ہر جاندار کو موت کا مزہ چکھنا ہے۔ — Allah sab ke darajaat buland farmaye. Ameen.
      </p>
      <p className="mt-12 text-lg text-emerald-600 font-bold">
       وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ: اور دنیا کی زندگی تو بس ایک دھوکے کی پونجی (مال) ہے۔
      </p>
    </div>
  );
}

export default Home;