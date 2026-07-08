import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {


  return (
    <nav className="bg-slate-950 fixed top-0 left-0 w-full h-16 z-50 text-white shadow-xl border-b border-emerald-900/30">
      <div className="max-w-6xl mx-auto px-6 h-full flex justify-between items-center">
        {/* Brand Title */}
        <Link to="/" className="text-xl font-bold flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
          ✨ Khayyan Memorial
        </Link>

        {/* Links & Translate Widget */}
        <div className="flex items-center gap-6 font-medium">
          <Link to="/" className="hover:text-emerald-400 transition-colors relative after:content-[''] after:absolute after:w-0 after:h-[3px] after:bg-emerald-500 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300">Home</Link>
          <Link to="/directory" className="hover:text-emerald-400 transition-colors relative after:content-[''] after:w-0 after:h-[3px] after:absolute after:left-0 after:-bottom-1 after:bg-emerald-500 hover:after:w-full hover:after:transition-all after:duration-300">Directory</Link>
          <Link to="/admin" className="bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-lg text-sm sm:text-xs font-semibold text-white shadow-lg transition-all hover:shadow-[0px_5px_20px_rgba(0,255,0,0.4)]">
            Admin Portal
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;