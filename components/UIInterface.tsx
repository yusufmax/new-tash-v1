import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { CameraMode } from '../types';
import gsap from 'gsap';
import { POI_DATA } from './POISystem';

export const UIInterface: React.FC = () => {
  const {
    layers,
    toggleLayer,
    mode,
    setMode,
    scrollProgress,
    isNight,
    setIsNight,
    setIsExploded,
    activePOI,
    setActivePOI
  } = useStore();

  const [showLayers, setShowLayers] = useState(false);

  // Premium Dark Slate for Day Mode
  const textColor = isNight ? 'text-white' : 'text-[#1e293b]';
  const borderColor = isNight ? 'border-white' : 'border-[#1e293b]';
  const logoColor = isNight ? 'white' : '#1e293b';

  const activePOIData = POI_DATA.find(p => p.id === activePOI);

  return (
    <div className={`fixed top-0 left-0 w-full h-full pointer-events-none z-20 font-sans ${textColor} select-none`}>

      {/* --- POI INFO CARD OVERLAY --- */}
      {activePOI && activePOIData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto bg-black/20 backdrop-blur-[2px] z-50">
          <div className={`p-8 rounded-2xl max-w-md w-full shadow-2xl relative border ${isNight ? 'bg-black/80 border-white/10 text-white' : 'bg-white/90 border-[#1e293b]/10 text-[#1e293b]'}`}>
            <button
              onClick={() => setActivePOI(null)}
              className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h2 className="text-3xl font-bold mb-2 tracking-tight">{activePOIData.title}</h2>
            <div className={`h-1 w-12 mb-6 rounded-full ${isNight ? 'bg-teal-400' : 'bg-teal-600'}`}></div>
            <p className={`text-lg leading-relaxed ${isNight ? 'text-gray-300' : 'text-slate-600'}`}>
              {activePOIData.description}
            </p>

            <div className="mt-8 flex gap-4">
              <button className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors ${isNight ? 'bg-teal-500 hover:bg-teal-400 text-black' : 'bg-teal-600 hover:bg-teal-700 text-white'}`}>
                Подробнее
              </button>
            </div>
          </div>
        </div>
      )}


      {/* --- TOP BAR --- */}
      <div className={`absolute top-0 left-0 w-full flex justify-between items-start p-8 md:p-12 pointer-events-auto bg-gradient-to-b ${isNight ? 'from-black/50' : 'from-white/50'} to-transparent transition-colors duration-500`}>

        {/* Logo Area */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            {/* Abstract Logo */}
            <svg width="40" height="25" viewBox="0 0 40 25" fill="none">
              <path d="M10 20C15 15 25 15 30 20" stroke={logoColor} strokeWidth="2" />
              <path d="M5 15C15 5 25 5 35 15" stroke={logoColor} strokeWidth="2" />
              <circle cx="20" cy="5" r="2" fill={logoColor} />
            </svg>
            <span className="text-[10px] tracking-[0.2em] mt-2 uppercase font-light text-center">YANGI<br />TOSHKENT</span>
          </div>

          <div className={`h-8 w-px ${isNight ? 'bg-white/30' : 'bg-[#1e293b]/30'} mx-2`}></div>

          <div className="flex items-center gap-3 text-sm font-light">
            <span className={`opacity-100 border-b ${borderColor} pb-0.5`}>RU</span>
            <span className="opacity-50 hover:opacity-100 cursor-pointer">UZ</span>
          </div>
        </div>

        {/* Right Action */}
        <button className="flex items-center gap-3 text-xs tracking-widest hover:opacity-70 transition-opacity group">
          НА ГЛАВНУЮ
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>


      {/* --- BOTTOM BAR --- */}
      <div className={`absolute bottom-0 left-0 w-full flex flex-col md:flex-row justify-between items-end p-8 md:p-12 pointer-events-auto bg-gradient-to-t ${isNight ? 'from-black/80 via-black/20' : 'from-white/80 via-white/20'} to-transparent transition-colors duration-500`}>

        {/* Left Controls */}
        <div className="flex items-center gap-6 mb-4 md:mb-0 w-full md:w-auto">
          {/* Unmute */}
          <button className="flex items-center gap-2 text-[10px] tracking-widest opacity-70 hover:opacity-100 uppercase">
            <div className="w-1 h-1 bg-teal-400 rounded-full animate-pulse"></div>
            ВКЛ. ЗВУК
          </button>

          {/* Day/Night Toggle */}
          <div className={`rounded-full p-1 flex items-center backdrop-blur-md border ${isNight ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/10'}`}>
            <button
              onClick={() => setIsNight(false)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${!isNight ? 'bg-[#1e293b] text-white' : 'text-white/50 hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </button>
            <button
              onClick={() => setIsNight(true)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isNight ? 'bg-teal-600 text-white' : 'text-[#1e293b]/50 hover:text-[#1e293b]'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            </button>
          </div>

          {/* Timeline Scrubber */}
          <div className={`hidden md:flex items-center gap-4 flex-1 min-w-[300px] h-12 px-4 border-l border-r relative ${isNight ? 'border-white/10' : 'border-[#1e293b]/10'}`}>
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isNight ? 'bg-white' : 'bg-[#1e293b]'}`}></div>

            {/* Track */}
            <div className={`w-full h-[2px] relative ${isNight ? 'bg-white/20' : 'bg-[#1e293b]/20'}`}>
              {/* Progress Fill */}
              <div
                className="absolute top-0 left-0 h-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                style={{ width: `${scrollProgress * 100}%` }}
              ></div>

              {/* Dragger / Current Point */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 border border-teal-400 bg-black rotate-45 transform"
                style={{ left: `${scrollProgress * 100}%`, marginLeft: '-6px' }}
              ></div>
            </div>

            <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1 h-1 rounded-full ${isNight ? 'bg-white' : 'bg-[#1e293b]'}`}></div>
          </div>

          {/* Map Icon (Free Roam) */}
          <button
            onClick={() => setMode(mode === CameraMode.SCROLL ? CameraMode.EXPLORE : CameraMode.SCROLL)}
            className={`w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all hover:bg-white/10 ${mode === CameraMode.EXPLORE ? 'bg-teal-500/20 border-teal-500' : (isNight ? 'border-white/20' : 'border-[#1e293b]/20')}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5-2.5 2.5z" />
            </svg>
          </button>
        </div>


        {/* Right Controls */}
        <div className="flex flex-col items-end gap-6 relative">

          {/* Layer Menu (Floating) */}
          <div className={`transition-all duration-300 origin-bottom-right absolute bottom-full right-0 mb-4 backdrop-blur-xl border p-4 rounded-lg min-w-[200px] ${showLayers ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} ${isNight ? 'bg-black/80 border-white/10' : 'bg-white/80 border-[#1e293b]/10'}`}>
            <h4 className={`text-xs uppercase tracking-widest mb-4 border-b pb-2 ${isNight ? 'text-gray-400 border-white/10' : 'text-slate-500 border-[#1e293b]/10'}`}>Компоненты</h4>
            <div className="space-y-3">
              {layers.map(layer => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className="flex items-center justify-between w-full text-xs tracking-wider hover:text-teal-400 transition-colors"
                >
                  <span>{layer.label}</span>
                  <div className={`w-2 h-2 rounded-full ${layer.active ? 'bg-teal-400 shadow-[0_0_5px_currentColor]' : 'bg-gray-700'}`}></div>
                </button>
              ))}
            </div>
          </div>

          {/* Button: Destination Location */}
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => { setMode(CameraMode.SCROLL); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 text-right">
              Обзор<br />Локации
            </span>
            <div className={`w-12 h-12 bg-white/5 border backdrop-blur-sm transform rotate-45 flex items-center justify-center group-hover:bg-teal-500/10 group-hover:border-teal-500 transition-all ${isNight ? 'border-white/10' : 'border-[#1e293b]/10'}`}>
              <div className="w-2 h-2 bg-teal-400 rounded-full transform -rotate-45"></div>
            </div>
          </div>

          {/* Button: Destination Components (Layers) */}
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => {
            const newState = !showLayers;
            setShowLayers(newState);
            setIsExploded(newState);
          }}>
            <span className="text-[10px] tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 text-right">
              Слои &<br />Компоненты
            </span>
            <div className={`w-12 h-12 bg-white/5 border backdrop-blur-sm transform rotate-45 flex items-center justify-center group-hover:bg-teal-500/10 group-hover:border-teal-500 transition-all ${showLayers ? 'bg-teal-500/10 border-teal-500' : (isNight ? 'border-white/10' : 'border-[#1e293b]/10')}`}>
              <div className="grid grid-cols-2 gap-1 transform -rotate-45">
                <div className={`w-1 h-1 rounded-full ${isNight ? 'bg-white' : 'bg-[#1e293b]'}`}></div>
                <div className={`w-1 h-1 rounded-full ${isNight ? 'bg-white' : 'bg-[#1e293b]'}`}></div>
                <div className={`w-1 h-1 rounded-full ${isNight ? 'bg-white' : 'bg-[#1e293b]'}`}></div>
                <div className="w-1 h-1 bg-teal-400 rounded-full shadow-[0_0_5px_currentColor]"></div>
              </div>
            </div>
          </div>

        </div>

        {/* Decorative Compass / Scroll Indicator on far right */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-2 opacity-30">
          <div className="text-[8px] uppercase tracking-widest -rotate-90">N</div>
          <div className={`w-px h-12 bg-gradient-to-b from-transparent to-transparent ${isNight ? 'via-white' : 'via-[#1e293b]'}`}></div>
        </div>

      </div>

    </div>
  );
};