import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Floating3DScene } from '../components/Floating3DHeart';
import img0 from '../assets/image_0.jpeg';
import img1 from '../assets/image_1.jpeg';
import img2 from '../assets/image_2.jpeg';
import img3 from '../assets/image_3.jpeg';
import img4 from '../assets/image_4.jpeg';
import img5 from '../assets/image_5.jpeg';

const images = [img0, img1, img2, img3, img4, img5];

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 20, 60, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(220, 20, 60, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 20, 60, 0); }
`;

const float = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  50% { opacity: 0.8; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

const PolaroidFloat = keyframes`
  0% { transform: translateY(10vh) rotate(-5deg); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-110vh) rotate(10deg); opacity: 0; }
`;

const LandingContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: radial-gradient(circle at center, ${({ theme }) => theme.colors.lightPink}, ${({ theme }) => theme.colors.pink});
    overflow: hidden;
`;

const TitleBox = styled.div`
    background: rgba(255, 255, 255, 0.3);
    padding: 4rem 6rem;
    border-radius: 30px;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    text-align: center;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const Title = styled.h1`
    font-size: 5.5rem;
    color: ${({ theme }) => theme.colors.red};
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
`;

const Subtitle = styled.p`
    font-size: 1.8rem;
    color: ${({ theme }) => theme.colors.maroon};
    font-family: 'Lora', serif;
    font-style: italic;
    margin-bottom: 3rem;
    opacity: 0.9;
`;

const Button = styled.button`
    padding: 1.2rem 3.5rem;
    font-size: 2rem;
    font-family: 'Dancing Script', cursive;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.red};
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    animation: ${pulse} 2s infinite;
    z-index: 50; /* Keep button on top */
    position: relative; /* Required for z-index */

    &:hover {
        background-color: ${({ theme }) => theme.colors.maroon};
        transform: scale(1.1) translateY(-2px);
        box-shadow: 0 6px 20px rgba(128, 0, 0, 0.6);
    }
`;

const FloatingElement = styled.div`
    position: absolute;
    color: ${props => props.$color || 'rgba(255, 255, 255, 0.8)'};
    font-size: ${props => props.size}px;
    left: ${props => props.left}%;
    bottom: -10%;
    animation: ${float} ${props => props.duration}s infinite linear;
    animation-delay: ${props => props.delay}s;
    z-index: 1;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
`;

const Polaroid = styled.div`
    position: absolute;
    width: 200px;
    padding: 10px 10px 30px 10px;
    background: white;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    left: ${props => props.left}%;
    bottom: -30%;
    animation: ${PolaroidFloat} ${props => props.duration}s infinite linear;
    animation-delay: ${props => props.delay}s;
    z-index: 2;
    border-radius: 4px;

    img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
`;

const emojis = ['❤', '✨', '🌸', '🧸', '💌', '💖', '🎀'];

const LandingPage = () => {
    const navigate = useNavigate();
    const [elements, setElements] = useState({ floaters: [], polaroids: [] });

    useEffect(() => {
        const newFloaters = Array.from({ length: 30 }).map((_, i) => {
            const isEmoji = Math.random() > 0.5;
            return {
                id: i,
                content: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : '❤',
                color: !isEmoji ? 'rgba(255, 255, 255, 0.8)' : undefined,
                left: Math.random() * 100,
                size: Math.random() * 30 + 15,
                duration: Math.random() * 8 + 6,
                delay: -(Math.random() * 15) // Negative delay makes them start already on-screen
            };
        });
        
        const polaroidsData = images.map((img, i) => ({
            id: i,
            img,
            left: Math.random() * 80 + 10,
            duration: Math.random() * 10 + 10, // Faster float speed (was 15-30s, now 10-20s)
            delay: -(Math.random() * 25) // Negative delay populates the screen instantly
        }));

        setElements({ floaters: newFloaters, polaroids: polaroidsData });
    }, []);

    return (
        <LandingContainer>
            <Floating3DScene />
            {elements.polaroids.map(p => (
                <Polaroid key={`p-${p.id}`} left={p.left} duration={p.duration} delay={p.delay}>
                    <img src={p.img} alt="memory" />
                </Polaroid>
            ))}
            {elements.floaters.map(item => (
                <FloatingElement 
                    key={`f-${item.id}`} 
                    left={item.left} 
                    size={item.size} 
                    duration={item.duration}
                    delay={item.delay}
                    $color={item.color}
                >
                    {item.content}
                </FloatingElement>
            ))}
            <TitleBox>
                <Title>For My Dearest Ammu...</Title>
                <Subtitle>A little digital journey from my heart to yours.</Subtitle>
                <Button onClick={() => navigate('/game')}>
                    Open My Heart
                </Button>
            </TitleBox>
        </LandingContainer>
    );
};

export default LandingPage;
