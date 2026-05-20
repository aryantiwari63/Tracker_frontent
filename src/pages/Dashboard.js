import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const user_info = useSelector((state) => state?.AuthReducer);

  useEffect(() => {
    const storedName = localStorage.getItem("name") || user_info?.name;
    if (storedName) {
      setUserName(storedName);
    }
  }, [user_info]);

  // Premium platform cards data
  const platformsList = [
    {
      title: "Digital Shelf Management",
      desc: "Analyze product visibility and digital shelf analytics across multiple e-commerce platforms in real-time.",
      color: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/10",
      status: "Active",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Media Automation Management",
      desc: "Optimize ad campaigns, manage bids dynamically, and maximize your return on ad spend (ROAS).",
      color: "from-purple-500 to-indigo-600",
      shadow: "shadow-purple-500/10",
      status: "Configured",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      title: "Product Information Management",
      desc: "Maintain a single source of truth for all your catalogs, descriptions, and assets globally.",
      color: "from-pink-500 to-rose-500",
      shadow: "shadow-rose-500/10",
      status: "Synchronized",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2M8 15h3m-3-3h3m2 0h3m-3-3h3" />
        </svg>
      )
    },
    {
      title: "Business Monitoring Analytics",
      desc: "Gain deep insights into sales patterns, inventory metrics, and overall platform growth curves.",
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/10",
      status: "Active",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex flex-col p-6 space-y-8 select-none">
      {/* Premium Hero Greeting Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 shadow-xl border border-indigo-900/40">
        {/* Futuristic glowing blurred backing */}
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-48 w-48 rounded-full bg-purple-500/10 blur-[60px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
              Welcome back to e-Genie
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
              Hello, <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent capitalize">{userName}</span>!
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Your unified commercial platform is fully configured and ready. Access your digital shelves, monitor performance, and drive automation effortlessly using the sidebar navigation.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="relative p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl hover:scale-105 transition-all duration-300">
              <img 
                src="/assets/images/egenie.gif" 
                alt="e-Genie Logo" 
                className="w-24 h-24 object-contain rounded-xl"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-sm -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of commercial platforms */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Your Connected Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Quick overview of standard e-Genie products and modules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformsList.map((platform, idx) => (
            <div 
              key={idx} 
              className={`group flex flex-col justify-between bg-white rounded-xl p-6 shadow-md hover:shadow-xl ${platform.shadow} border border-slate-100 hover:border-indigo-100 transition-all duration-300 ease-out transform hover:-translate-y-1 cursor-pointer`}
            >
              <div className="space-y-4">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${platform.color} shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {platform.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-300">
                    {platform.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    {platform.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 group-hover:text-slate-600 transition-colors duration-300">Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  {platform.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aesthetic quick tip banner */}
      <div className="flex items-start gap-4 p-5 bg-blue-50/50 rounded-xl border border-blue-100/60 backdrop-blur-sm">
        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800">Quick Navigation Tip</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hover over or click on the sidebar menu icons on the left to expand platform-specific actions (e.g. Amazon, Flipkart, Blinkit) and access dedicated campaign metrics, rule engines, and search analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
