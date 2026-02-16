import React from 'react';
import { useStore } from '../store/useStore';

export const LotInfoPanel: React.FC = () => {
    const activeLotId = useStore((state) => state.activeLot);
    const lots = useStore((state) => state.lots);
    const isNight = useStore((state) => state.isNight);
    const setActiveLot = useStore((state) => state.setActiveLot);

    const activeLot = lots.find(l => l.id === activeLotId);

    if (!activeLot) return null;

    return (
        <div className={`fixed top-1/2 left-8 -translate-y-1/2 z-30 p-8 rounded-2xl max-w-sm w-full shadow-2xl border backdrop-blur-md transition-all duration-500 ${isNight ? 'bg-black/80 border-white/10 text-white' : 'bg-white/90 border-[#1e293b]/10 text-[#1e293b]'}`}>

            {/* Close Button */}
            <button
                onClick={() => setActiveLot(null)}
                className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex items-center gap-3 mb-6">
                <div className={`w-2 h-8 ${activeLot.status === 'available' ? 'bg-blue-500' : (activeLot.status === 'reserved' ? 'bg-yellow-500' : 'bg-red-500')}`}></div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Участок {activeLot.id.split('-')[1]}</h2>
                    <p className="text-xs uppercase tracking-widest opacity-70">
                        {activeLot.status === 'available' ? 'Свободен' : (activeLot.status === 'reserved' ? 'Забронирован' : 'Продан')}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Площадь</p>
                    <p className="text-xl font-mono">{activeLot.area}</p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Стоимость</p>
                    <p className="text-3xl font-bold text-teal-500">{activeLot.price}</p>
                </div>

                <div>
                    <p className="text-xs uppercase tracking-widest opacity-50 mb-1">Размеры</p>
                    <p className="text-sm opacity-80">{activeLot.size[0]}м x {activeLot.size[1]}м</p>
                </div>

                <button className={`w-full py-4 mt-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeLot.status === 'available'
                        ? (isNight ? 'bg-teal-500 hover:bg-teal-400 text-black' : 'bg-teal-600 hover:bg-teal-700 text-white')
                        : 'bg-gray-500 cursor-not-allowed opacity-50 text-white'
                    }`}>
                    {activeLot.status === 'available' ? 'Оставить Заявку' : 'Недоступно'}
                </button>
            </div>

        </div>
    );
};
