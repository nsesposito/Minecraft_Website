
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, GizmoHelper, GizmoViewport, TransformControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { BlockData, BlockType, ToolMode, TransformMode, Vector3 } from '../types';
import { BLOCK_DEFINITIONS } from '../constants';

interface EditorSceneProps {
  blocks: BlockData[];
  selectedBlockId: string | null;
  selectedBlockType: BlockType;
  toolMode: ToolMode;
  transformMode: TransformMode;
  onPlaceBlock: (pos: Vector3, type: BlockType) => void;
  onUpdateBlock: (id: string, updates: Partial<BlockData>) => void;
  onSelectBlock: (id: string | null) => void;
}

const Block = ({ 
  data, 
  isSelected, 
  onClick 
}: { 
  data: BlockData; 
  isSelected: boolean; 
  onClick: (e: ThreeEvent<MouseEvent>) => void; 
}) => {
  const def = BLOCK_DEFINITIONS[data.type];
  
  // Convert array vectors to Three objects for the mesh
  const position = new THREE.Vector3(...data.position);
  const rotation = new THREE.Euler(
    THREE.MathUtils.degToRad(data.rotation[0]),
    THREE.MathUtils.degToRad(data.rotation[1]),
    THREE.MathUtils.degToRad(data.rotation[2])
  );
  const scale = new THREE.Vector3(...data.scale);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={def.color} 
          transparent={def.transparent} 
          opacity={def.transparent ? 0.6 : 1}
          roughness={0.8}
          metalness={0.1}
        />
        {/* Selection Highlight */}
        {isSelected && (
          <meshBasicMaterial color="#ffff00" wireframe />
        )}
      </mesh>
      {/* Edge highlight for better visibility */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color={isSelected ? "#ffff00" : "black"} linewidth={1} opacity={0.3} transparent />
      </lineSegments>
    </group>
  );
};

const PreviewBlock = ({ position, type }: { position: Vector3; type: BlockType }) => {
  const def = BLOCK_DEFINITIONS[type];
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={def.color} transparent opacity={0.5} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial color="white" opacity={0.5} transparent />
      </lineSegments>
    </mesh>
  );
};

export const EditorScene: React.FC<EditorSceneProps> = ({
  blocks,
  selectedBlockId,
  selectedBlockType,
  toolMode,
  transformMode,
  onPlaceBlock,
  onUpdateBlock,
  onSelectBlock
}) => {
  const [hoverPos, setHoverPos] = useState<Vector3 | null>(null);
  const orbitControlsRef = useRef<any>(null);

  // Find the selected block object to attach TransformControls
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  // Helper to get raw position for transform controls (reconstruct from data)
  const selectedPosition = selectedBlock ? new THREE.Vector3(...selectedBlock.position) : new THREE.Vector3();
  const selectedRotation = selectedBlock ? new THREE.Euler(
    THREE.MathUtils.degToRad(selectedBlock.rotation[0]),
    THREE.MathUtils.degToRad(selectedBlock.rotation[1]),
    THREE.MathUtils.degToRad(selectedBlock.rotation[2])
  ) : new THREE.Euler();
  const selectedScale = selectedBlock ? new THREE.Vector3(...selectedBlock.scale) : new THREE.Vector3();


  const handlePointerMove = (e: ThreeEvent<MouseEvent>) => {
    // Only calculate placement ghost if in Place mode
    if (toolMode !== 'place') {
      setHoverPos(null);
      return;
    }
    
    e.stopPropagation();

    // Snap to grid logic
    const snap = (val: number) => Math.floor(val) + 0.5;

    if (e.object.type === 'GridHelper' || e.object.userData.isGround) {
        // Ground placement
        setHoverPos([snap(e.point.x), 0.5, snap(e.point.z)]);
    } else if (e.face) {
        // Placement against another block
        const n = e.face.normal;
        const p = e.point.clone().add(n.multiplyScalar(0.5));
        setHoverPos([snap(p.x), snap(p.y), snap(p.z)]);
    }
  };

  const handleBackgroundClick = (e: ThreeEvent<MouseEvent>) => {
    // Deselect if clicking empty space
    onSelectBlock(null);
  };

  const handleBlockClick = (e: ThreeEvent<MouseEvent>, id: string) => {
    e.stopPropagation();
    if (toolMode === 'select') {
      onSelectBlock(id);
    } 
    // If in place mode, we might be placing ON this block. handled by handlePlaceClick logic below?
    // Actually simpler: if in place mode, click creates block at ghost.
  };

  const handlePlaceClick = (e: ThreeEvent<MouseEvent>) => {
    if (toolMode === 'place' && hoverPos) {
      e.stopPropagation();
      onPlaceBlock(hoverPos, selectedBlockType);
    }
  };

  return (
    <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }} onPointerMissed={() => onSelectBlock(null)}>
      <color attach="background" args={['#1a1a1a']} />
      <ambientLight intensity={0.6} />
      <pointLight position={[20, 30, 20]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />
      <Environment preset="city" />

      <group>
        {blocks.map((block) => (
          <Block 
            key={block.id} 
            data={block} 
            isSelected={block.id === selectedBlockId}
            onClick={(e) => handleBlockClick(e, block.id)}
          />
        ))}

        {toolMode === 'place' && hoverPos && (
          <PreviewBlock position={hoverPos} type={selectedBlockType} />
        )}

        {/* Transform Gizmo for Selected Block */}
        {selectedBlockId && selectedBlock && toolMode === 'select' && (
          <TransformControls
            object={undefined} // Controlled via position/rotation props not direct attachment to ref to avoid re-render loops with react state
            position={selectedPosition}
            rotation={selectedRotation}
            scale={selectedScale}
            mode={transformMode}
            onObjectChange={(e: any) => {
              const o = e.target.object;
              if (!o) return;
              
              // Convert Three.js values back to our data model
              const newPos: Vector3 = [o.position.x, o.position.y, o.position.z];
              const newRot: Vector3 = [
                 THREE.MathUtils.radToDeg(o.rotation.x),
                 THREE.MathUtils.radToDeg(o.rotation.y),
                 THREE.MathUtils.radToDeg(o.rotation.z)
              ];
              const newScale: Vector3 = [o.scale.x, o.scale.y, o.scale.z];

              onUpdateBlock(selectedBlockId, {
                position: newPos,
                rotation: newRot,
                scale: newScale
              });
            }}
            onMouseDown={() => {
                if(orbitControlsRef.current) orbitControlsRef.current.enabled = false;
            }}
            onMouseUp={() => {
                if(orbitControlsRef.current) orbitControlsRef.current.enabled = true;
            }}
          >
             {/* We put a dummy invisible mesh here to anchor the controls visually if needed, 
                 but TransformControls in controlled mode works differently. 
                 Actually, @react-three/drei TransformControls attaches to its child if provided.
             */}
             <mesh visible={false} position={selectedPosition} rotation={selectedRotation} scale={selectedScale}>
                 <boxGeometry />
             </mesh>
          </TransformControls>
        )}

        {/* Invisible Ground Plane for Raycasting */}
        <mesh 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0, 0]} 
          userData={{ isGround: true }}
          onPointerMove={handlePointerMove}
          onClick={handlePlaceClick}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        <Grid 
          position={[0, -0.01, 0]} 
          args={[100, 100]} 
          cellSize={1} 
          cellThickness={1} 
          cellColor="#444" 
          sectionSize={5} 
          sectionThickness={1.5} 
          sectionColor="#208020" 
          fadeDistance={60} 
        />
        
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#e54b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
        </GizmoHelper>
        
        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={40} blur={2} far={4.5} />

        <OrbitControls ref={orbitControlsRef} makeDefault />
      </group>
    </Canvas>
  );
};
