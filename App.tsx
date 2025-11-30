
import React, { useState, useCallback } from 'react';
import { EditorScene } from './components/EditorScene';
import { Toolbar } from './components/Toolbar';
import { ExportModal } from './components/ExportModal';
import { BlockData, BlockType, ToolMode, TransformMode, Vector3, ViewState } from './types';
import { Boxes, Info, ArrowRight, Github } from 'lucide-react';

const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Landing Page Component ---
const LandingPage = ({ onStart, onAbout }: { onStart: () => void; onAbout: () => void }) => (
  <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center relative overflow-hidden">
    {/* Animated Background Grids (CSS handled via Tailwind/Style) */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.8),rgba(20,20,20,0.8)),url('https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center z-0 animate-pulse-slow"></div>
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0"></div>

    <div className="z-10 text-center max-w-4xl px-6">
      <div className="mb-8 animate-bounce-slow">
         <span className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-800 drop-shadow-sm" style={{ WebkitTextStroke: '2px white' }}>
           BEDROCK FMBE
         </span>
      </div>
      
      <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light">
        The Ultimate 3D <span className="text-yellow-400 font-bold">Display Entity</span> & <span className="text-blue-400 font-bold">Falling Block</span> Builder.
        <br/>Create insane animations, bosses, and decorations for Minecraft Bedrock.
      </p>

      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <button 
          onClick={onStart}
          className="group relative px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-xl rounded-none border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
        >
          <span className="flex items-center gap-3">
            START BUILDING <ArrowRight className="group-hover:translate-x-1 transition-transform"/>
          </span>
        </button>
        <button 
          onClick={onAbout}
          className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xl rounded-none border-b-4 border-gray-900 active:border-b-0 active:translate-y-1 transition-all"
        >
          WHAT IS FMBE?
        </button>
      </div>
    </div>

    <div className="absolute bottom-4 text-gray-500 text-sm">
      Not affiliated with Mojang Studios. Built for the Bedrock Community.
    </div>
  </div>
);

// --- About Page Component ---
const AboutPage = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-[#1a1a1a] text-white p-8 overflow-y-auto">
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-green-400 mb-8 hover:underline">
        <ArrowRight className="rotate-180" size={20}/> Back to Home
      </button>

      <h1 className="text-4xl font-bold mb-6 text-green-500">What is FMBE?</h1>
      <div className="prose prose-invert lg:prose-xl">
        <p className="text-gray-300 mb-4">
          **FMBE** stands for **Falling Minecraft Block Entity**. It's a technique (and community term) used in Minecraft Bedrock Edition to create objects that look like blocks but aren't constrained to the grid.
        </p>
        <p className="text-gray-300 mb-4">
          By using entities (like Armor Stands or custom Display Entities), map makers can:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-6">
          <li><span className="text-yellow-400">Scale</span> blocks to be giant or tiny.</li>
          <li><span className="text-blue-400">Rotate</span> blocks freely on any axis.</li>
          <li><span className="text-red-400">Animate</span> structures to create dynamic bosses, vehicles, or furniture.</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-white">How this Tool Works</h2>
        <p className="text-gray-300 mb-4">
          This website allows you to build using a 3D interface that supports these transformations. When you export, we generate the complex command chains needed to summon these entities in your game.
        </p>
        <p className="text-gray-300 mb-4">
          We support two modes:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-gray-300">
          <li><strong>Vanilla Hack:</strong> Uses invisible armor stands with blocks on their heads, scaled using the <code>playanimation</code> command.</li>
          <li><strong>Display Entities:</strong> Generates commands for modern Add-ons (like the one found on wiki.bedrock.dev) for cleaner results.</li>
        </ol>
      </div>
    </div>
  </div>
);


// --- Main App ---
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType>(BlockType.GRASS);
  const [toolMode, setToolMode] = useState<ToolMode>('place');
  const [transformMode, setTransformMode] = useState<TransformMode>('translate');
  
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Get current block data for UI
  const selectedBlockData = blocks.find(b => b.id === selectedBlockId);

  const handlePlaceBlock = useCallback((position: Vector3, type: BlockType) => {
    const newId = generateId();
    setBlocks((prev) => [
      ...prev,
      {
        id: newId,
        position,
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        type,
      },
    ]);
    // Automatically select the new block to tweak it immediately?
    // Let's not, to allow rapid placement. 
  }, []);

  const handleUpdateBlock = useCallback((id: string, updates: Partial<BlockData>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }, [selectedBlockId]);

  const handleClear = useCallback(() => {
    if (window.confirm("Delete everything?")) {
      setBlocks([]);
      setSelectedBlockId(null);
    }
  }, []);

  const handleSetToolMode = (mode: ToolMode) => {
    setToolMode(mode);
    if (mode === 'place') {
      setSelectedBlockId(null);
    }
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('editor')} onAbout={() => setView('about')} />;
  }

  if (view === 'about') {
    return <AboutPage onBack={() => setView('landing')} />;
  }

  return (
    <div className="w-full h-screen bg-[#1a1a1a] flex flex-col relative font-sans">
      
      {/* Editor Header */}
      <div className="absolute top-0 left-0 z-10 p-4">
         <h1 className="text-2xl font-black italic text-white drop-shadow-md cursor-pointer select-none" onClick={() => setView('landing')}>
           BEDROCK <span className="text-green-500">FMBE</span>
         </h1>
      </div>

      <div className="absolute top-0 right-0 z-10 p-4 flex gap-2">
         <button onClick={() => setView('about')} className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 text-white">
            <Info size={20} />
         </button>
      </div>

      {/* Main 3D Canvas */}
      <div className="flex-1 w-full h-full">
        <EditorScene
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          selectedBlockType={selectedBlockType}
          toolMode={toolMode}
          transformMode={transformMode}
          onPlaceBlock={handlePlaceBlock}
          onUpdateBlock={handleUpdateBlock}
          onSelectBlock={setSelectedBlockId}
        />
      </div>

      {/* UI Overlay */}
      <Toolbar
        selectedBlockType={selectedBlockType}
        toolMode={toolMode}
        transformMode={transformMode}
        selectedBlockData={selectedBlockData}
        onSelectBlockType={setSelectedBlockType}
        onSetToolMode={handleSetToolMode}
        onSetTransformMode={setTransformMode}
        onUpdateBlock={handleUpdateBlock}
        onDeleteBlock={handleDeleteBlock}
        onClear={handleClear}
        onExport={() => setIsExportOpen(true)}
        onExit={() => setView('landing')}
      />

      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        blocks={blocks} 
      />
    </div>
  );
};

export default App;
