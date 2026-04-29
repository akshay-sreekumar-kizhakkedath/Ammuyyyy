import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Floating3DScene } from '../components/Floating3DHeart';

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

const FloatingSticker = styled.div`
    position: absolute;
    color: ${props => props.$color || 'rgba(255, 255, 255, 0.8)'};
    font-size: ${props => props.size}px;
    left: ${props => props.left}%;
    bottom: -10%;
    animation: ${float} ${props => props.duration}s infinite linear;
    animation-delay: ${props => props.delay}s;
    z-index: 1;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    pointer-events: none;
`;

const emojis = ['❤', '✨', '🌸', '🧸', '💌', '💖', '🎀'];

const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: radial-gradient(circle at top left, ${({ theme }) => theme.colors.lightPink}, ${({ theme }) => theme.colors.pink});
    padding: 4rem 1rem;
    font-family: 'Georgia', serif;
`;

const Title = styled.h1`
    font-size: 5rem;
    font-family: 'Dancing Script', cursive;
    color: ${({ theme }) => theme.colors.red};
    margin-bottom: 4rem;
    text-shadow: 2px 2px 5px rgba(0,0,0,0.1);
    text-align: center;
`;

const LettersGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3rem;
    max-width: 1000px;
    margin-bottom: 4rem;
`;

const LetterCard = styled.div`
    width: 300px;
    height: 380px;
    perspective: 1500px;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-10px);
    }
`;

const LetterInner = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform-style: preserve-3d;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

const LetterFace = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(128, 0, 0, 0.15);
    padding: 2rem;
`;

const LetterFront = styled(LetterFace)`
    background-color: #FAF0E6; /* Off-white elegant envelope color */
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: inset 0 0 40px rgba(0,0,0,0.02), 0 10px 25px rgba(128, 0, 0, 0.2);
    
    /* Envelope flap design */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 55%;
        background-color: #FFF5EE;
        clip-path: polygon(0 0, 100% 0, 50% 100%);
        border-radius: 15px 15px 0 0;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        z-index: 1;
    }
`;

const WaxSeal = styled.div`
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    background: radial-gradient(circle at 30% 30%, #a00, #500);
    border-radius: 50%;
    box-shadow: 
        inset 0 0 5px rgba(255,255,255,0.3),
        inset 0 -3px 5px rgba(0,0,0,0.5),
        0 5px 10px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #ffcccb;
    z-index: 15;
    border: 1px solid #600;

    &::after {
        content: '❤';
        position: absolute;
        text-shadow: -1px -1px 1px rgba(255,255,255,0.2), 1px 1px 1px rgba(0,0,0,0.8);
    }
`;

const LetterBack = styled(LetterFace)`
    background-color: #Fdfbf7;
    background-image: repeating-linear-gradient(transparent, transparent 29px, #e5e5e5 29px, #e5e5e5 30px);
    transform: rotateY(180deg);
    border: 1px solid #e0d8c0;
    color: ${({ theme }) => theme.colors.maroon};
    box-shadow: inset 0 0 30px rgba(0,0,0,0.05), 0 10px 25px rgba(128, 0, 0, 0.2);
    padding-top: 3.5rem; /* Space for the paper lines */
`;

const MessageText = styled.p`
    font-size: 1.8rem;
    line-height: 1.8;
    font-family: 'Dancing Script', cursive;
    color: #3e0c0c; /* Deep, ink-like dark red/brown */
    padding: 0 15px;
    text-shadow: 0px 0px 1px rgba(0,0,0,0.1); /* Give it an ink-bleed look */
`;

const ContinueButton = styled.button`
    padding: 1.2rem 3.5rem;
    font-size: 1.8rem;
    font-family: 'Dancing Script', cursive;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.red};
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(220, 20, 60, 0.4);
    opacity: ${({ $show }) => ($show ? 1 : 0)};
    pointer-events: ${({ $show }) => ($show ? 'auto' : 'none')};
    transform: translateY(${({ $show }) => ($show ? '0' : '20px')});
    z-index: 50; /* Ensure button is above the 3D heart */
    position: relative; /* Required for z-index to work */

    &:hover {
        background-color: ${({ theme }) => theme.colors.maroon};
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 6px 20px rgba(128, 0, 0, 0.6);
    }
`;

const messages = [
    "I've loved you since the first moment I saw you.",
    "Every day with you feels like a beautiful dream I never want to wake up from.",
    "Thank you for being my joy, my peace, and my greatest adventure."
];

const LettersPage = () => {
    const [openLetters, setOpenLetters] = useState(new Set());
    const navigate = useNavigate();

    // Generate random background floaters
    const [bgFloaters] = useState(() => Array.from({ length: 20 }).map((_, i) => {
        const isEmoji = Math.random() > 0.5;
        return {
            id: i,
            content: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : '❤',
            color: !isEmoji ? 'rgba(255, 255, 255, 0.8)' : undefined,
            left: Math.random() * 100,
            size: Math.random() * 25 + 15,
            duration: Math.random() * 10 + 8,
            delay: -(Math.random() * 20) // Negative delay fills screen instantly
        };
    }));

    const toggleLetter = (index) => {
        setOpenLetters((prev) => {
            const newSet = new Set(prev);
            newSet.add(index);
            return newSet;
        });
    };

    const allRead = openLetters.size === messages.length;

    return (
        <PageContainer>
            <Floating3DScene />
            {bgFloaters.map(item => (
                <FloatingSticker 
                    key={item.id} 
                    left={item.left} 
                    size={item.size} 
                    duration={item.duration}
                    delay={item.delay}
                    $color={item.color}
                >
                    {item.content}
                </FloatingSticker>
            ))}
            <Title style={{ zIndex: 10 }}>Notes From My Heart</Title>
            <LettersGrid style={{ zIndex: 10 }}>
                {messages.map((msg, index) => {
                    const isOpen = openLetters.has(index);
                    return (
                        <LetterCard key={index} onClick={() => toggleLetter(index)}>
                            <LetterInner $isOpen={isOpen}>
                                <LetterFront>
                                    <WaxSeal />
                                    <p style={{ zIndex: 10, marginTop: '120px', color: '#8B0000', fontFamily: "'Dancing Script', cursive", fontSize: '2rem', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        Open Me
                                    </p>
                                </LetterFront>
                                <LetterBack>
                                    <MessageText>"{msg}"</MessageText>
                                </LetterBack>
                            </LetterInner>
                        </LetterCard>
                    );
                })}
            </LettersGrid>

            <ContinueButton $show={allRead} onClick={() => navigate('/ending')}>
                My Final Question
            </ContinueButton>
        </PageContainer>
    );
};

export default LettersPage;
