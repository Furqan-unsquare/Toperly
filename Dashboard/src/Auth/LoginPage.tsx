import React, { useContext } from 'react';
import { useAuth } from "@/contexts/AuthContext";

export default function InstructorLogin() {
    const { loginWithSocial } = useAuth(); 

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Blue Gradient */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white flex-col justify-between p-8 lg:p-12"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/82/88/a9/8288a984840efba268f78e43ec110787.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Top Section */}
        <div>
          <p className="text-gray-900 text-md font-semibold opacity-75 mb-6">In Partnership with Gov of India</p>
        </div>  

        {/* Bottom Section */}
        <div>
          <p className="text-gray-900 text-sm opacity-90 mb-6">You can easily</p>
          <h1 className="text-gray-900 text-4xl lg:text-5xl font-bold leading-tight mb-8">
            Speed up your work<br />
            with our Web App
          </h1>
        </div>
      </div>


    <div>
     {/* Mobile Header - Only visible on small screens */}
      <div className=" absolute lg:hidden text-center h-full w-full">
        <div className="w-full h-full rounded-lg flex items-center justify-center"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/82/88/a9/8288a984840efba268f78e43ec110787.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div className="-mt-16 -ml-10 text-left">
            <p className="text-2xl opacity-90 mb-2">You can easily</p>
            <h1 className="text-3xl font-bold">Speed up your work<br />with our Web App</h1>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="absolute bg-white bottom-0 md:-top-1/2 mt-80 rounded-t-3xl w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-xl">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2">Become Student Now</h2>
            <p className="text-sm text-gray-600">Please sign up or Log in to your account to continue</p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => loginWithSocial('google-oauth2')}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.60 3.3-4.53 6.16-4.53z"/>
              </svg>
              Login with Google
            </button>

            <button
              onClick={() => loginWithSocial('github')}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.71c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.56 4.94.36.31.68.92.68 1.85v2.74c0 .26.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"/>
              </svg>
              Login with GitHub
            </button>

            <button
              onClick={() => loginWithSocial('facebook')}
              className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="blue">
                <path d="M24 12.07C24 5.37 18.63 0 12 0S0 5.37 0 12.07c0 5.99 4.39 10.99 10.12 11.87v-8.38H7.07v-3.49h3.05V9.52c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87v2.24h3.32l-.53 3.49h-2.79v8.38C19.61 23.06 24 18.06 24 12.07z"/>
              </svg>
               Login with Facebook
            </button>
          </div>
        </div>
      </div>   
    </div>
    </div>
  );
}