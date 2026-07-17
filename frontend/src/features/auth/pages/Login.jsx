import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { useSelector } from 'react-redux';

const Login = () => {
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const {handleLogin} = useAuth();
  const navigate = useNavigate();

  const user = useSelector(state=>state.auth.user);
  const loading = useSelector(state=>state.auth.loading);


  const submitForm = async(e)=>{
   e.preventDefault();

    const payload = {
      email,
      password
    }

    try {
      await handleLogin(payload);
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
    }
  }

  if(!loading && user){
    navigate("/"); 

  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-800/50">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-400 mt-2 text-sm font-medium">Sign in to continue to your account</p>
          </div>

          <form onSubmit={(e)=>{
            submitForm(e);
          }} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300"
                placeholder="Enter your email"
                required
                onChange = {(e)=>{
                  setEmail(e.target.value)
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300"
                placeholder="Enter your password"
                required
                onChange ={(e)=>{
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                <input 
                  type="checkbox" 
                  className="mr-2 h-4 w-4 rounded border-gray-700 bg-gray-800 text-red-500 focus:ring-red-500 focus:ring-offset-gray-900 transition-colors" 
                />
                Remember me
              </label>
              <a href="#" className="text-red-500 hover:text-red-400 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-red-500/40"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
