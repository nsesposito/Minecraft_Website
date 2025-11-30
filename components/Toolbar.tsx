
import React from 'react';
import { BlockType, ToolMode, TransformMode, Vector3, BlockData } from '../types';
import { BLOCK_DEFINITIONS } from '../constants';
import { Pickaxe, Box, MousePointer2, Move, Rotate3D, Scaling, Trash2, ArrowRight } from 'lucide-react';

interface ToolbarProps {
  selectedBlockType: BlockType;
  toolMode: ToolMode;
  transformMode: TransformMode;
  selectedBlockData: BlockData | undefined;
  onSelectBlockType: (type: BlockType) => void;
  onSetToolMode: (mode: ToolMode) => void;
  onSetTransformMode: (mode: TransformMode) => void;
  onUpdateBlock: (id: string, data: Partial<BlockData>) => void;
  onDeleteBlock: (id: string) => void;
  onClear: () => void;
  onExport: () => void;
  onExit: () => void;
}

const NumberInput = ({ 
  label, 
  value, 
  onChange,
  step = 0.1
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void;
  step?: number;
}) => (
  <div className="flex items-center gap-2">
    <span className="text-gray-400 text-xs w-4">{label}</span>
    <input
      type="number"
      value={Number(value.toFixed(2))}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-16 bg-gray-800 border border-gray-600 rounded px-1 text-xs text-white focus:border-green-500 outline-none"
    />
  </div>
);

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedBlockType,
  toolMode,
  transformMode,
  selectedBlockData,
  onSelectBlockType,
  onSetToolMode,
  onSetTransformMode,
  onUpdateBlock,
  onDeleteBlock,
  onClear,
  onExport,
  onExit,
}) => {
  return (
    <>
      {/* Top Bar - Tools */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 border border-gray-600 rounded-xl p-2 shadow-xl flex gap-4 backdrop-blur-md">
        <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => onSetToolMode('select')}
            className={`p-2 rounded transition-all ${toolMode === 'select' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            title="Select & Edit (V)"
          >
            <MousePointer2 size={20} />
          </button>
          <button
            onClick={() => onSetToolMode('place')}
            className={`p-2 rounded transition-all ${toolMode === 'place' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            title="Place Blocks (B)"
          >
            <Box size={20} />
          </button>
        </div>

        {toolMode === 'select' && (
           <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
             <button
               onClick={() => onSetTransformMode('translate')}
               className={`p-2 rounded transition-all ${transformMode === 'translate' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
               title="Move (G)"
             >
               <Move size={20} />
             </button>
             <button
               onClick={() => onSetTransformMode('rotate')}
               className={`p-2 rounded transition-all ${transformMode === 'rotate' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
               title="Rotate (R)"
             >
               <Rotate3D size={20} />
             </button>
             <button
               onClick={() => onSetTransformMode('scale')}
               className={`p-2 rounded transition-all ${transformMode === 'scale' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
               title="Scale (S)"
             >
               <Scaling size={20} />
             </button>
           </div>
        )}
        
        <div className="w-px bg-gray-700 mx-2" />
        
        <button
          onClick={onExport}
          className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded font-bold transition-all shadow-[0_2px_0_rgb(161,98,7)] active:shadow-none active:translate-y-[2px]"
        >
          EXPORT
        </button>
        <button
          onClick={onExit}
          className="text-gray-500 hover:text-white px-2 transition-colors text-xs"
        >
          Exit
        </button>
      </div>

      {/* Right Sidebar - Properties */}
      {selectedBlockData && toolMode === 'select' && (
        <div className="absolute top-24 right-4 w-64 bg-gray-900/90 border border-gray-600 rounded-lg p-4 shadow-xl backdrop-blur-md text-white">
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h3 className="font-bold text-sm text-green-400">Properties</h3>
            <button 
              onClick={() => onDeleteBlock(selectedBlockData.id)}
              className="text-red-400 hover:text-red-300 p-1"
              title="Delete Block (Del)"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1 block">POSITION</label>
              <div className="flex gap-2">
                <NumberInput label="X" value={selectedBlockData.position[0]} onChange={(v) => onUpdateBlock(selectedBlockData.id, { position: [v, selectedBlockData.position[1], selectedBlockData.position[2]] })} />
                <NumberInput label="Y" value={selectedBlockData.position[1]} onChange={(v) => onUpdateBlock(selectedBlockData.id, { position: [selectedBlockData.position[0], v, selectedBlockData.position[2]] })} />
                <NumberInput label="Z" value={selectedBlockData.position[2]} onChange={(v) => onUpdateBlock(selectedBlockData.id, { position: [selectedBlockData.position[0], selectedBlockData.position[1], v] })} />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-bold mb-1 block">ROTATION (Deg)</label>
              <div className="flex gap-2">
                <NumberInput label="X" step={15} value={selectedBlockData.rotation[0]} onChange={(v) => onUpdateBlock(selectedBlockData.id, { rotation: [v, selectedBlockData.rotation[1], selectedBlockData.rotation[2]] })} />
                <NumberInput label="Y" step={15} value={selectedBlockData.rotation[1]} onChange={(v) => onUpdateBlock(selectedBlockData.id, { rotation: [selectedBlockData.rotation[0], v, selectedBlockData.rotation[2]] })} />
                <NumberInput label="Z" step={15} value={selectedBlockData.rotation[2]} onChange={(v) => onUpdateBlock(selectedBlockData.id, { rotation: [selectedBlockData.rotation[0], selectedBlockData.rotation[1], v] })} />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 font-bold mb-1 block">SCALE</label>
              <div className="flex gap-2">
                <NumberInput label="X" value={selectedBlockData.scale[0]} onChange={(v) => onUpdateBlock(selectedBlockData.id, { scale: [v, selectedBlockData.scale[1], selectedBlockData.scale[2]] })} />
                <NumberInput label="Y" value={selectedBlockData.scale[1]} onChange={(v) => onUpdateBlock(selectedBlockData.id, { scale: [selectedBlockData.scale[0], v, selectedBlockData.scale[2]] })} />
                <NumberInput label="Z" value={selectedBlockData.scale[2]} onChange={(v) => onUpdateBlock(selectedBlockData.id, { scale: [selectedBlockData.scale[0], selectedBlockData.scale[1], v] })} />
              </div>
              <button 
                className="mt-2 text-xs text-blue-400 hover:text-blue-300 w-full text-center border border-blue-900 rounded py-1"
                onClick={() => onUpdateBlock(selectedBlockData.id, { scale: [1, 1, 1] })}
              >
                Reset Scale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar - Palette */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/90 border-2 border-gray-600 rounded-lg p-2 shadow-2xl backdrop-blur-sm flex gap-2 overflow-x-auto max-w-[90vw] scrollbar-hide">
        {Object.values(BLOCK_DEFINITIONS).map((def) => (
          <button
            key={def.type}
            onClick={() => {
              onSelectBlockType(def.type);
              onSetToolMode('place');
            }}
            className={`flex-shrink-0 w-12 h-12 rounded border-2 transition-transform hover:scale-105 relative group ${
              selectedBlockType === def.type
                ? 'border-white ring-2 ring-yellow-400 z-10 scale-105' 
                : 'border-gray-600 opacity-80 hover:opacity-100'
            }`}
            style={{ backgroundColor: def.color }}
            title={def.name}
          >
             {/* Simple visual indicator for transparent blocks */}
             {def.transparent && (
                <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzjwqhgYGARAXCAOYwMzGwDjQAxeR8klCwAAAABJRU5ErkJggg==')] opacity-30"></div>
             )}
          </button>
        ))}
      </div>
    </>
  );
};
