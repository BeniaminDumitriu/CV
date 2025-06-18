import { Color, Euler, Vector3 } from '@react-three/fiber';
import { useMemo } from 'react';
import { Object3D } from 'three';

interface Props {
  color?: Color;
  intensity?: number;
  position?: Vector3;
  scale?: Vector3;
  rotation?: Euler;
  targetPosition?: Vector3;
}

export const DirectionalLight = ({ intensity, color, position, targetPosition, scale, rotation }: Props) => {
  const target = useMemo(() => new Object3D(), []);
  return (
    <group>
      <directionalLight
        castShadow
        intensity={intensity}
        color={color}
        position={position}
        scale={scale}
        rotation={rotation}
        target={target}
        shadow-mapSize={[1024, 1024]}>
        <orthographicCamera attach="shadow-camera" args={[-15, 15, 15, -15]} />
      </directionalLight>
      <primitive object={target} position={targetPosition} />
    </group>
  );
}; 