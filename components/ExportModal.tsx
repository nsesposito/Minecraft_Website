
import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { BlockData } from '../types';
import { generateCommands } from '../services/bedrockCommandService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  blocks: BlockData[];
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, blocks }) => {
  const [mode, setMode] = useState<'vanilla_armor_stand' | 'display_entity_addon'>('vanilla_armor_stand');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const commands = generateCommands(blocks, mode);

  const handleCopy = () => {
    navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#1e1e1e] border-2 border-green-800 rounded-lg w-full max-w-4xl flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(34,197,94,0.2)]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-[#151515]">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-green-500">⚡</span> FMBE Command Export
            </h2>
            <p className="text-gray-400 text-sm mt-1">Generate .mcfunction content for Minecraft Bedrock</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col gap-6">
          
          <div className="bg-gray-800/50 p-4 rounded border border-gray-700">
             <h3 className="text-white font-bold mb-2">Select Export Format:</h3>
             <div className="flex gap-4">
                <button
                  onClick={() => setMode('vanilla_armor_stand')}
                  className={`flex-1 py-3 px-4 rounded border-2 transition-all text-left group ${
                    mode === 'vanilla_armor_stand' 
                      ? 'border-green-500 bg-green-900/20' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className={`font-bold ${mode === 'vanilla_armor_stand' ? 'text-green-400' : 'text-gray-300'}`}>Vanilla Armor Stands</div>
                  <div className="text-xs text-gray-500 mt-1">Uses Armor Stands + PlayAnimation hacks. Works in Vanilla Bedrock. Ideal for widespread compatibility.</div>
                </button>

                <button
                  onClick={() => setMode('display_entity_addon')}
                  className={`flex-1 py-3 px-4 rounded border-2 transition-all text-left group ${
                    mode === 'display_entity_addon' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className={`font-bold ${mode === 'display_entity_addon' ? 'text-purple-400' : 'text-gray-300'}`}>Display Entity (Add-on)</div>
                  <div className="text-xs text-gray-500 mt-1">Uses <code>wiki:display_entity</code> or custom entities. Requires an Add-on to be installed in your world.</div>
                </button>
             </div>
          </div>

          <div className="relative flex-1 bg-black rounded border border-gray-700 overflow-hidden flex flex-col">
            <div className="bg-[#2a2a2a] px-4 py-2 text-xs text-gray-400 border-b border-gray-700 flex justify-between">
               <span>function.mcfunction</span>
               <span>{commands.split('\n').length} lines</span>
            </div>
            <textarea
              className="w-full h-full bg-[#0a0a0a] text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
              readOnly
              value={commands}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-[#151515] flex justify-between items-center">
          <div className="text-xs text-gray-500">
             Tip: Use a Repeating Command Block or Function file to execute these.
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded text-gray-300 hover:text-white font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-8 py-2 rounded font-bold transition-all shadow-lg ${
                copied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'COPIED!' : 'COPY COMMANDS'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
