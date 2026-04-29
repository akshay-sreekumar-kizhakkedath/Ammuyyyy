import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const HeartShape = () => {
    const shape = useMemo(() => {
        const x = 0;
        const y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo( x + 2.5, y + 2.5 );
        heartShape.bezierCurveTo( x + 2.5, y + 2.5, x + 2.0, y, x, y );
        heartShape.bezierCurveTo( x - 3.0, y, x - 3.0, y + 3.5,x - 3.0, y + 3.5 );
        heartShape.bezierCurveTo( x - 3.0, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5 );
        heartShape.bezierCurveTo( x + 6.0, y + 7.7, x + 8.0, y + 5.5, x + 8.0, y + 3.5 );
        heartShape.bezierCurveTo( x + 8.0, y + 3.5, x + 8.0, y, x + 5.0, y );
        heartShape.bezierCurveTo( x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5 );
        return heartShape;
    }, []);

    const extrudeSettings = {
        depth: 1,
        bevelEnabled: true,
        bevelSegments: 10,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1
    };

    const meshRef = useRef();

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005; // Slow rotation
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            {/* By setting position to [0,0,0] and using onUpdate={() => geom.center()}
                we guarantee that the heart rotates perfectly on its exact center axis,
                preventing it from swinging left/right unevenly. */}
            <mesh ref={meshRef} position={[0, 0, 0]} scale={0.7} rotation={[Math.PI, 0, 0]}>
                <extrudeGeometry args={[shape, extrudeSettings]} onUpdate={(geom) => geom.center()} />
                <MeshDistortMaterial 
                    color="#DC143C" 
                    envMapIntensity={2} 
                    clearcoat={1} 
                    clearcoatRoughness={0} 
                    metalness={0.2}
                    roughness={0.1}
                    distort={0.1} 
                    speed={2}
                />
            </mesh>
        </Float>
    );
};

export const Floating3DScene = () => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
            <Canvas camera={{ position: [0, 0, 20], fov: 40 }}>
                {/* Wrap the heart in a group to guarantee perfect center alignment inside the camera's view */}
                <group position={[0, 0, 0]}>
                    <HeartShape />
                </group>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FFC0CB" />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};
