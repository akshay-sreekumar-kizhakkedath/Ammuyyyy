import React, { useState } from 'react';
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

const EndingContainer = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.maroon};
    color: ${({ theme }) => theme.colors.cream};
    font-family: 'Georgia', serif;
    overflow: hidden;
    position: relative;
`;

const ContentWrapper = styled.div`
    text-align: center;
    z-index: 20; /* Keep text slightly below buttons but above 3D */
    padding: 3rem 4rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    position: relative;
`;

const MainText = styled.h1`
    font-size: 5rem;
    font-family: 'Dancing Script', cursive;
    margin-bottom: 1rem;
    text-shadow: 0 4px 10px rgba(0,0,0,0.3);
    color: ${({ theme }) => theme.colors.white};
`;

const SubText = styled.p`
    font-size: 1.8rem;
    margin-bottom: 3rem;
    color: ${({ theme }) => theme.colors.lightPink};
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 2rem;
    position: relative;
    height: 60px;
    z-index: 50; /* Ensure buttons are above the 3D element */
`;

const BaseButton = styled.button`
    padding: 1rem 2.5rem;
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.2s ease;
`;

const YesButton = styled(BaseButton)`
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.maroon};
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);

    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
    }
`;

const NoButton = styled(BaseButton).attrs(props => ({
    style: {
        transform: `translate(${props.offsetX}px, ${props.offsetY}px)`,
    },
}))`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.white};
    border: 2px solid ${({ theme }) => theme.colors.white};
    position: absolute;
    /* initial positioning */
    left: 50%;
    margin-left: 10px; /* half gap offset */
`;

const SuccessMessage = styled.div`
    font-size: 4rem;
    font-family: 'Dancing Script', cursive;
    color: ${({ theme }) => theme.colors.white};
    text-align: center;
    animation: fadeIn 1.5s ease-in;
    background: rgba(128, 0, 0, 0.7); /* Added dark background for contrast */
    padding: 2rem 4rem; /* Added padding to create a pill/box effect */
    border-radius: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5); /* Stronger shadow to pop against images */
    border: 2px solid rgba(255, 255, 255, 0.2);

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

const FloatingHeart = styled.div`
    position: absolute;
    color: rgba(255, 192, 203, 0.3);
    font-size: ${props => props.size}px;
    left: ${props => props.left}%;
    top: ${props => props.top}%;
    animation: float ${props => props.duration}s infinite linear;
    animation-delay: ${props => props.delay}s;

    @keyframes float {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        50% { opacity: 0.6; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
`;

const slideInFromSides = keyframes`
    0% { transform: translateX(var(--startX)) scale(0.8) rotate(var(--startRot)); opacity: 0; }
    100% { transform: translateX(0) scale(1) rotate(var(--endRot)); opacity: 1; }
`;

const ImageCollage = styled.div`
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
    display: ${props => props.$show ? 'block' : 'none'};
`;

const FinalPolaroid = styled.div`
    position: absolute;
    width: 250px;
    padding: 12px 12px 40px 12px;
    background: white;
    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    border-radius: 4px;
    top: ${props => props.top}%;
    left: ${props => props.left}%;
    --startX: ${props => props.startX}px;
    --startRot: ${props => props.startRot}deg;
    --endRot: ${props => props.endRot}deg;
    animation: ${slideInFromSides} 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: ${props => props.delay}s;
    opacity: 0;

    img {
        width: 100%;
        height: 250px;
        object-fit: cover;
    }
`;

const ResetButton = styled.button`
    margin-top: 3rem;
    padding: 1rem 3.5rem;
    font-size: 1.8rem;
    font-family: 'Dancing Script', cursive;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.red};
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
    animation: fadeIn 2s ease-in;
    animation-delay: 2s; /* Appears after polaroids settle */
    animation-fill-mode: both;
    position: relative;
    z-index: 100; /* Ensure it is absolutely above EVERYTHING */

    &:hover {
        background-color: ${({ theme }) => theme.colors.maroon};
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8);
    }
`;

const EndingPage = () => {
    const navigate = useNavigate();
    const [accepted, setAccepted] = useState(false);
    const [noOffsets, setNoOffsets] = useState({ x: 0, y: 0 });

    const handleNoHover = () => {
        const randomX = (Math.random() - 0.5) * 300;
        const randomY = (Math.random() - 0.5) * 300;
        setNoOffsets({ x: randomX, y: randomY });
    };

    const emojis = ['💍', '🥺', '💖', '🎉', '🦋', '✨', '🥰', '💐'];

    // Generate random background floaters (hearts + emojis)
    const bgFloaters = Array.from({ length: 25 }).map((_, i) => {
        const isEmoji = Math.random() > 0.6;
        return {
            id: i,
            content: isEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : '❤',
            left: Math.random() * 100,
            top: Math.random() * 100 + 100,
            size: Math.random() * 30 + 15,
            duration: Math.random() * 10 + 8,
            delay: -(Math.random() * 20) // Fills screen from the moment it loads
        };
    });

    // Pre-calculate positions for polaroids to frame the center
    const polaroidPositions = [
        { top: 10, left: 10, startX: -500, startRot: -45, endRot: -15 },
        { top: 15, left: 70, startX: 500, startRot: 45, endRot: 20 },
        { top: 50, left: 5, startX: -500, startRot: -30, endRot: -10 },
        { top: 60, left: 75, startX: 500, startRot: 60, endRot: 15 },
        { top: 30, left: -5, startX: -600, startRot: -90, endRot: -25 },
        { top: 40, left: 85, startX: 600, startRot: 90, endRot: 25 },
    ];

    return (
        <EndingContainer>
            <Floating3DScene />
            {bgFloaters.map(item => (
                <FloatingHeart 
                    key={item.id} 
                    left={item.left} 
                    top={item.top} 
                    size={item.size} 
                    duration={item.duration}
                    style={{ color: item.content === '❤' ? 'rgba(255, 192, 203, 0.4)' : undefined }}
                >
                    {item.content}
                </FloatingHeart>
            ))}

            <ImageCollage $show={accepted}>
                {images.map((img, i) => {
                    const pos = polaroidPositions[i % polaroidPositions.length];
                    return (
                        <FinalPolaroid 
                            key={`final-p-${i}`}
                            top={pos.top}
                            left={pos.left}
                            startX={pos.startX}
                            startRot={pos.startRot}
                            endRot={pos.endRot}
                            delay={i * 0.2}
                        >
                            <img src={img} alt="us" />
                        </FinalPolaroid>
                    )
                })}
            </ImageCollage>

            {!accepted ? (
                <ContentWrapper>
                    <MainText>Will you be mine?</MainText>
                    <SubText>I promise to love you always.</SubText>
                    <ButtonsContainer>
                        <YesButton onClick={() => setAccepted(true)}>Yes</YesButton>
                        <NoButton 
                            onMouseEnter={handleNoHover} 
                            onClick={handleNoHover}
                            offsetX={noOffsets.x}
                            offsetY={noOffsets.y}
                        >
                            No
                        </NoButton>
                    </ButtonsContainer>
                </ContentWrapper>
            ) : (
                <div style={{ position: 'relative', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SuccessMessage>
                        Thank you. ❤<br/>
                        <span style={{ fontSize: '1.8rem', color: '#FFC0CB', display: 'block', marginTop: '20px', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            I promise to always cherish you.
                        </span>
                    </SuccessMessage>
                    <ResetButton onClick={() => navigate('/')}>
                        Experience Again
                    </ResetButton>
                </div>
            )}
        </EndingContainer>
    );
};

export default EndingPage;
