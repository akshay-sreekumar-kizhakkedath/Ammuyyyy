import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const CursorWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
`;

const Dot = styled.div`
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: ${({ theme }) => theme.colors.red};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.red}, 0 0 20px ${({ theme }) => theme.colors.pink};
    transition: width 0.2s, height 0.2s;
`;

const Ring = styled.div`
    position: absolute;
    width: 40px;
    height: 40px;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, transform 0.1s ease-out;
`;

const particleAnim = keyframes`
    0% { transform: scale(1) translate(0, 0); opacity: 1; }
    100% { transform: scale(0) translate(var(--tx), var(--ty)); opacity: 0; }
`;

const Particle = styled.div`
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.pink};
    border-radius: 50%;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: ${particleAnim} 0.8s forwards;
`;

const CustomCursor = () => {
    const [pos, setPos] = useState({ x: -100, y: -100 });
    const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        let animationFrame;
        let targetX = -100;
        let targetY = -100;
        let currentX = -100;
        let currentY = -100;

        const onMouseMove = (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            setPos({ x: targetX, y: targetY });

            // Create trail particles
            if (Math.random() > 0.5) {
                setParticles(prev => [
                    ...prev,
                    {
                        id: Date.now() + Math.random(),
                        x: targetX,
                        y: targetY,
                        tx: `${(Math.random() - 0.5) * 50}px`,
                        ty: `${(Math.random() - 0.5) * 50}px`
                    }
                ].slice(-15)); // Keep only last 15 particles
            }
        };

        const render = () => {
            currentX += (targetX - currentX) * 0.2; // Smooth follow
            currentY += (targetY - currentY) * 0.2;
            setRingPos({ x: currentX, y: currentY });
            animationFrame = requestAnimationFrame(render);
        };

        window.addEventListener('mousemove', onMouseMove);
        animationFrame = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    // Clean up particles
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prev => prev.slice(1));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <CursorWrapper>
            {particles.map(p => (
                <Particle key={p.id} style={{ left: p.x, top: p.y, '--tx': p.tx, '--ty': p.ty }} />
            ))}
            <Ring style={{ left: ringPos.x, top: ringPos.y }} />
            <Dot style={{ left: pos.x, top: pos.y }} />
        </CursorWrapper>
    );
};

export default CustomCursor;