import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { SectionData, CameraMode } from '../types';
import gsap from 'gsap';

const SECTIONS: SectionData[] = [
  {
    id: 0,
    title: "Видение",
    description: "Янги Тошкент — это город будущего, где природа и технологии сливаются в единую экосистему для комфортной жизни.",
    progressStart: 0,
    progressEnd: 0.18
  },
  {
    id: 1,
    title: "Деловой Центр",
    description: "Сердце экономической активности. Современные бизнес-башни, работающие на возобновляемой энергии, формируют новый горизонт города.",
    progressStart: 0.25,
    progressEnd: 0.40
  },
  {
    id: 2,
    title: "Зеленый Пояс",
    description: "Легкие города. Парки, скверы и вертикальные сады обеспечивают чистый воздух и пространство для отдыха жителей.",
    progressStart: 0.50,
    progressEnd: 0.65
  },
  {
    id: 3,
    title: "Инфраструктура",
    description: "Умные транспортные сети и автономные системы обеспечивают мобильность и доступность любой точки за 15 минут.",
    progressStart: 0.75,
    progressEnd: 0.88
  },
  {
    id: 4,
    title: "Будущее Здесь",
    description: "Присоединяйтесь к созданию новой главы в истории нашей великой столицы. Янги Тошкент ждет вас.",
    progressStart: 0.92,
    progressEnd: 1.0
  }
];

export const Overlay: React.FC = () => {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const setActiveSection = useStore((state) => state.setActiveSection);
  const isNight = useStore((state) => state.isNight);
  const mode = useStore((state) => state.mode);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Determine active section based on progress
    let currentIdx = -1;
    SECTIONS.forEach((section, idx) => {
      // Strict check within bounds to avoid overlap
      if (scrollProgress >= section.progressStart && scrollProgress <= section.progressEnd) {
        currentIdx = idx;
      }
    });

    if (currentIdx !== -1) {
      setActiveSection(currentIdx);

      // Animate sections in/out
      sectionRefs.current.forEach((el, idx) => {
        if (!el) return;
        if (idx === currentIdx) {
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            overwrite: true
          });
        } else {
          gsap.to(el, {
            autoAlpha: 0,
            y: 20,
            duration: 0.4,
            ease: "power3.in",
            overwrite: true
          });
        }
      });
    } else {
      // Hide all if between sections
      sectionRefs.current.forEach((el) => {
        if (el) gsap.to(el, {
          autoAlpha: 0,
          y: 20,
          duration: 0.3,
          overwrite: true
        });
      });
    }

  }, [scrollProgress, setActiveSection]);

  const textColor = isNight ? 'text-white' : 'text-[#1e293b]';
  const descColor = isNight ? 'text-gray-300' : 'text-slate-600';

  return (
    <div className={`fixed inset-0 pointer-events-none z-10 flex flex-col justify-center items-start px-8 md:px-24 max-w-7xl mx-auto ${textColor} transition-opacity duration-500 ${mode === CameraMode.EXPLORE ? 'opacity-0' : 'opacity-100'}`}>
      {SECTIONS.map((section, idx) => (
        <div
          key={section.id}
          ref={(el) => { sectionRefs.current[idx] = el }}
          className="absolute w-full max-w-3xl opacity-0 invisible" // Start invisible
        >
          <div className="relative">
            {/* Large Background Number */}
            <span className={`absolute -top-20 -left-12 text-[8rem] md:text-[14rem] font-bold select-none -z-10 leading-none tracking-tighter mix-blend-overlay ${isNight ? 'text-white/5' : 'text-[#1e293b]/5'}`}>
              0{section.id + 1}
            </span>

            {/* Section Header */}
            <div className="flex items-center space-x-4 mb-4 pl-2">
              <span className="text-sm md:text-base font-mono text-yellow-500 tracking-widest uppercase">
                Part 0{section.id + 1}
              </span>
              <div className="h-px w-8 bg-yellow-500/50"></div>
            </div>

            {/* Title */}
            <h1 className={`text-5xl md:text-8xl font-bold mb-8 tracking-tight leading-[0.9] drop-shadow-lg ${isNight ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70' : 'text-[#1e293b]'}`}>
              {section.title}
            </h1>

            {/* Description with left border */}
            <div className="flex pl-2">
              <div className="w-1 bg-gradient-to-b from-yellow-500 to-transparent mr-6 rounded-full h-24 shrink-0"></div>
              <p className={`text-base md:text-xl leading-relaxed font-light max-w-lg shadow-black drop-shadow-md ${descColor}`}>
                {section.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};