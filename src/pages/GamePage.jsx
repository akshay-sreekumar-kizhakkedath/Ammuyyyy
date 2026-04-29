import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Floating3DScene } from '../components/Floating3DHeart';

const GameContainer = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.cream}, ${({ theme }) => theme.colors.pink});
    overflow: hidden;
    font-family: 'Georgia', serif;
    cursor: ${props => props.$gameWon ? 'auto' : 'none'}; /* Hide cursor during gameplay, show on win */
`;

const CollectorWrapper = styled.div.attrs(props => ({
    style: {
        transform: `translateX(${props.x}px)`,
    },
}))`
    position: absolute;
    bottom: 30px;
    left: -40px; /* Offset half width to center on cursor */
    width: 80px; /* Made smaller to increase challenge */
    height: 140px;
    border: 6px solid ${({ theme }) => theme.colors.maroon};
    border-top: none;
    border-radius: 0 0 30px 30px;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    overflow: hidden;
    z-index: 10;
    box-shadow: 0 10px 20px rgba(128, 0, 0, 0.2);
    
    /* Lip of the jar */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -10px;
        right: -10px;
        height: 6px;
        background-color: ${({ theme }) => theme.colors.maroon};
        border-radius: 10px;
    }
`;

const FillArea = styled.div.attrs(props => ({
    style: {
        height: `${props.fill}%`,
    },
}))`
    position: absolute;
    bottom: 0;
    width: 100%;
    background: linear-gradient(to top, ${({ theme }) => theme.colors.red}, ${({ theme }) => theme.colors.pink});
    transition: height 0.4s ease-out;
    opacity: 0.85;
`;

const HeartIcon = styled.div`
    position: absolute;
    top: -20px;
    width: 100%;
    text-align: center;
    font-size: 2rem;
    color: white;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    animation: pulse 1s infinite alternate;

    @keyframes pulse {
        0% { transform: scale(1); }
        100% { transform: scale(1.1); }
    }
`;

const fall = keyframes`
    0% { transform: translateY(-100px) rotate(0deg); }
    100% { transform: translateY(100vh) rotate(360deg); }
`;

const FallingHeart = styled.div.attrs(props => ({
    style: {
        left: `${props.left}px`,
        animationDuration: `${props.duration}s`,
    },
}))`
    position: absolute;
    top: -50px;
    width: 35px;
    height: 35px;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${props => props.$type === 'black' ? '%23000000' : '%23FF0000'}"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    animation-name: ${fall};
    animation-timing-function: linear;
    z-index: 5;
    filter: ${props => props.$type === 'black' ? 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' : 'none'};
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 253, 208, 0.85); /* Cream with opacity */
    backdrop-filter: blur(8px);
    z-index: 20;
    color: ${({ theme }) => theme.colors.maroon};
    text-align: center;
    padding: 2rem;
`;

const Title = styled.h2`
    font-size: 4.5rem;
    font-family: 'Dancing Script', cursive;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(255, 192, 203, 0.5);
`;

const SubText = styled.p`
    font-size: 1.5rem;
    font-family: 'Lora', serif;
    margin-bottom: 2rem;
`;

const Button = styled.button`
    padding: 1rem 2.5rem;
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.maroon};
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(128, 0, 0, 0.3);

    &:hover {
        background-color: ${({ theme }) => theme.colors.red};
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
    }
`;

const ProgressText = styled.div`
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 1.8rem;
    font-weight: bold;
    font-family: 'Dancing Script', cursive;
    color: ${({ theme }) => theme.colors.maroon};
    background: rgba(255, 255, 255, 0.7);
    padding: 10px 20px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    z-index: 10;
`;

const InstructionText = styled.div`
    position: absolute;
    top: 40%;
    width: 100%;
    text-align: center;
    font-size: 2rem;
    font-family: 'Dancing Script', cursive;
    color: ${({ theme }) => theme.colors.red};
    opacity: ${props => props.show ? 0.7 : 0};
    transition: opacity 1s ease-out;
    pointer-events: none;
    z-index: 1;
`;

const MAX_HEARTS = 25; // Increased required hearts for more challenge

const GamePage = () => {
    const [mouseX, setMouseX] = useState(window.innerWidth / 2);
    const [hearts, setHearts] = useState([]);
    const [score, setScore] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [showInstruction, setShowInstruction] = useState(true);
    const scoreRef = useRef(0);
    const navigate = useNavigate();

    // Smooth tracking without CSS transition lag
    const handleMouseMove = useCallback((e) => {
        if (!gameWon) {
            setMouseX(e.clientX);
            if (showInstruction) setShowInstruction(false);
        }
    }, [gameWon, showInstruction]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    const createHeart = useCallback(() => {
        if (gameWon) return;
        const isBlack = Math.random() > 0.8; // 20% chance for a black heart
        const newHeart = {
            id: Date.now() + Math.random(),
            left: Math.random() * (window.innerWidth - 50) + 25,
            duration: Math.random() * 1.5 + 1.5,
            type: isBlack ? 'black' : 'red',
        };
        setHearts((prev) => [...prev, newHeart]);
    }, [gameWon]);

    useEffect(() => {
        if (gameWon) return;

        let animationFrameId;

        const checkCollisions = () => {
            setHearts(prevHearts => {
                let pointsChange = 0;
                const remaining = prevHearts.filter(heart => {
                    const hEl = document.getElementById(`heart-${heart.id}`);
                    const cEl = document.getElementById('collector');
                    
                    if (!hEl || !cEl) return true;

                    const hRect = hEl.getBoundingClientRect();
                    const cRect = cEl.getBoundingClientRect();

                    const heartCenterX = hRect.left + hRect.width / 2;
                    const heartCenterY = hRect.top + hRect.height / 2;

                    const isColliding = 
                        heartCenterY > cRect.top && 
                        heartCenterY < cRect.top + 30 &&
                        heartCenterX > cRect.left && 
                        heartCenterX < cRect.right;

                    if (isColliding) {
                        pointsChange += heart.type === 'black' ? -2 : 1; // Black heart penalty
                        return false;
                    }
                    
                    return hRect.top < window.innerHeight;
                });

                if (pointsChange !== 0) {
                    scoreRef.current = Math.max(0, scoreRef.current + pointsChange); // Prevent negative score
                    setScore(scoreRef.current);
                    if (scoreRef.current >= MAX_HEARTS) {
                        setGameWon(true);
                    }
                }
                return remaining;
            });
            animationFrameId = requestAnimationFrame(checkCollisions);
        };

        animationFrameId = requestAnimationFrame(checkCollisions);
        const spawnInterval = setInterval(createHeart, 350); // Spawn hearts faster (every 350ms instead of 600ms)

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearInterval(spawnInterval);
        };
    }, [gameWon, createHeart]);

    const handleNext = () => {
        navigate('/letters');
    };

    const fillPercentage = Math.min((score / MAX_HEARTS) * 100, 100);

    return (
        <GameContainer $gameWon={gameWon}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.5, pointerEvents: 'none' }}>
                <Floating3DScene />
            </div>

            <InstructionText show={showInstruction}>
                Move your mouse to collect the falling hearts...
            </InstructionText>

            <ProgressText>
                {score} / {MAX_HEARTS} Hearts
            </ProgressText>

            <CollectorWrapper id="collector" x={mouseX} style={{ zIndex: 15 }}>
                <FillArea fill={fillPercentage}>
                    {score > 0 && <HeartIcon>❤</HeartIcon>}
                </FillArea>
            </CollectorWrapper>

            {hearts.map(heart => (
                <FallingHeart
                    key={heart.id}
                    id={`heart-${heart.id}`}
                    left={heart.left}
                    duration={heart.duration}
                    $type={heart.type}
                    style={{ zIndex: 10 }}
                />
            ))}

            {gameWon && (
                <Overlay style={{ zIndex: 20 }}>
                    <Title>You've filled my heart! ❤</Title>
                    <SubText>Every piece of it belongs to you.</SubText>
                    <Button onClick={handleNext}>Read My Letters</Button>
                </Overlay>
            )}
        </GameContainer>
    );
};

export default GamePage;
