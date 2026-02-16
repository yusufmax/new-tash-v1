import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export const AudioController: React.FC = () => {
    const isMuted = useStore((state) => state.isMuted);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element if not exists
        if (!audioRef.current) {
            audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-piano-amp-strings-10711.mp3');
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        }

        if (isMuted) {
            audioRef.current.pause();
        } else {
            // Attempt to play
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Audio playback failed (usually autoplay policy):", error);
                });
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [isMuted]);

    return null; // Invisible component
};
