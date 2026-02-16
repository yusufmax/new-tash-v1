import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export const LoadingScreen: React.FC = () => {
    const { progress, active } = useProgress();
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (!active && progress === 100) {
            // Add a small delay for smooth transition
            const timer = setTimeout(() => setShow(false), 500);
            return () => clearTimeout(timer);
        } else {
            setShow(true);
        }
    }, [active, progress]);

    if (!show) return null;

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-1000 ${(!active && progress === 100) ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

            {/* Logo Area */}
            <div className="flex flex-col items-center mb-12 animate-pulse">
                <svg width="60" height="37" viewBox="0 0 40 25" fill="none" className="mb-4">
                    <path d="M10 20C15 15 25 15 30 20" stroke="white" strokeWidth="2" />
                    <path d="M5 15C15 5 25 5 35 15" stroke="white" strokeWidth="2" />
                    <circle cx="20" cy="5" r="2" fill="white" />
                </svg>
                <div className="text-white text-xs tracking-[0.3em] uppercase font-light text-center">
                    YANGI<br />TOSHKENT
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                {/* Progress Fill */}
                <div
                    className="absolute top-0 left-0 h-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Percentage Text */}
            <div className="mt-4 font-mono text-teal-400 text-sm">
                {Math.round(progress)}%
            </div>

            <div className="mt-2 text-white/30 text-[10px] tracking-widest uppercase">
                Загрузка 3D Модели
            </div>

        </div>
    );
};
