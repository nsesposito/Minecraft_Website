
export type Vector3 = [number, number, number];

export enum BlockType {
  GRASS = 'grass',
  DIRT = 'dirt',
  STONE = 'stone',
  OAK_PLANKS = 'oak_planks',
  OBSIDIAN = 'obsidian',
  GLASS = 'glass',
  GLOWSTONE = 'glowstone',
  RED_WOOL = 'red_wool',
  BLUE_WOOL = 'blue_wool',
  GREEN_WOOL = 'green_wool',
  COMMAND_BLOCK = 'command_block',
  BARRIER = 'barrier',
}

export interface BlockData {
  id: string;
  position: Vector3;
  rotation: Vector3; // Euler angles in degrees
  scale: Vector3;
  type: BlockType;
}

export interface BlockDefinition {
  type: BlockType;
  color: string; // Fallback color
  texture?: string; // Placeholder for texture mapping if we added it
  name: string;
  bedrockId: string; // The identifier used in commands
  transparent?: boolean;
}

export type ToolMode = 'select' | 'place';
export type TransformMode = 'translate' | 'rotate' | 'scale';
export type ViewState = 'landing' | 'editor' | 'about';
