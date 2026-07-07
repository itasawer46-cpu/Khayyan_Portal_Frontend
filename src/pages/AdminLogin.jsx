import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

 const handleLogin = (e) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'admin123') {
      setError('');
      
      // --- LOGIC ADDED HERE ---
      // Browser ki memory me flag save karwa rahe hain
      localStorage.setItem('isAdmin', 'true');
      
      alert('Login Successful!');
      navigate('/admin/dashboard'); 
    } else {
      setError('Invalid Username or Password! Dobara koshish karein.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 mt-24">
      <div className="max-w-md w-full space-y-8 p-8 bg-slate-200 rounded-2xl shadow-md border-2 border-emerald-600 hover:scale-105 transition-all duration-300">
        
        {/* Heading Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-600 tracking-tight">
            Admin Portal
          </h2>
          <p className="mt-2 text-sm uppercase text-emerald-600 font-bold">
            Khayyan Memorial Portal ke intezamia ke liye login
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username / Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-xl relative block bg-white w-full px-4 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-gray-400"
                placeholder="Username darj karein (e.g., admin)"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
                placeholder="Password darj karein (e.g., admin123)"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 shadow-sm"
            >
              Login Karein
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;