
import { BlockType, BlockDefinition } from './types';

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  [BlockType.GRASS]: {
    type: BlockType.GRASS,
    color: '#5b8c38',
    name: 'Grass Block',
    bedrockId: 'grass',
  },
  [BlockType.DIRT]: {
    type: BlockType.DIRT,
    color: '#805936',
    name: 'Dirt',
    bedrockId: 'dirt',
  },
  [BlockType.STONE]: {
    type: BlockType.STONE,
    color: '#7d7d7d',
    name: 'Stone',
    bedrockId: 'stone',
  },
  [BlockType.OAK_PLANKS]: {
    type: BlockType.OAK_PLANKS,
    color: '#ba8c54',
    name: 'Oak Planks',
    bedrockId: 'planks',
  },
  [BlockType.OBSIDIAN]: {
    type: BlockType.OBSIDIAN,
    color: '#140c1c',
    name: 'Obsidian',
    bedrockId: 'obsidian',
  },
  [BlockType.GLASS]: {
    type: BlockType.GLASS,
    color: '#aaddff',
    name: 'Glass',
    bedrockId: 'glass',
    transparent: true,
  },
  [BlockType.GLOWSTONE]: {
    type: BlockType.GLOWSTONE,
    color: '#f7e78e',
    name: 'Glowstone',
    bedrockId: 'glowstone',
  },
  [BlockType.RED_WOOL]: {
    type: BlockType.RED_WOOL,
    color: '#a02020',
    name: 'Red Wool',
    bedrockId: 'wool 14',
  },
  [BlockType.BLUE_WOOL]: {
    type: BlockType.BLUE_WOOL,
    color: '#2020a0',
    name: 'Blue Wool',
    bedrockId: 'wool 11',
  },
  [BlockType.GREEN_WOOL]: {
    type: BlockType.GREEN_WOOL,
    color: '#20a020',
    name: 'Green Wool',
    bedrockId: 'wool 13',
  },
  [BlockType.COMMAND_BLOCK]: {
    type: BlockType.COMMAND_BLOCK,
    color: '#c77e4f',
    name: 'Command Block',
    bedrockId: 'command_block',
  },
  [BlockType.BARRIER]: {
    type: BlockType.BARRIER,
    color: '#ff0000',
    name: 'Barrier',
    bedrockId: 'barrier',
    transparent: true,
  },
};

export const INITIAL_CAMERA_POSITION: [number, number, number] = [8, 8, 8];
export const GRID_SIZE = 32;
