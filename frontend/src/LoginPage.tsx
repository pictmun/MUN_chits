import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Add authentication logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative w-96 h-[420px] bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Gradient Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 animate-pulse opacity-30 blur-xl"></div>
        
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 p-6 space-y-6 bg-gray-900 rounded-lg"
          autoComplete="off"
        >
          <h2 className="text-2xl font-semibold text-center text-blue-400">
            Log in
          </h2>
          {/* Email Input */}
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-3 py-3 text-white bg-transparent border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              className="absolute left-3 top-3 text-gray-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 transform -translate-y-5 scale-75 transition duration-200 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-400"
            >
              Email
            </label>
          </div>
          {/* Password Input */}
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-3 py-3 text-white bg-transparent border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label
              className="absolute left-3 top-3 text-gray-400 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 transform -translate-y-5 scale-75 transition duration-200 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-blue-400"
            >
              Password
            </label>
          </div>
          {/* Links */}
          <div className="flex justify-between text-sm text-gray-400">
            <a href="#" className="hover:text-blue-400">Forgot Password?</a>
            <a href="/signup" className="hover:text-blue-400">Signup</a>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
