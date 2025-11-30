
import { BlockData, BlockType } from '../types';
import { BLOCK_DEFINITIONS } from '../constants';

/**
 * Generates Bedrock commands for FMBE/Display Entities.
 * 
 * Supports two modes:
 * 1. Vanilla (Armor Stands + PlayAnimation Hacks)
 * 2. Add-on (Display Entity - recommended for modern Bedrock dev)
 */

const formatFloat = (num: number) => Number(num.toFixed(4));

export const generateCommands = (blocks: BlockData[], mode: 'vanilla_armor_stand' | 'display_entity_addon'): string => {
  if (blocks.length === 0) return "# No blocks placed in the editor.";

  let output = `## Bedrock FMBE Export - ${new Date().toLocaleDateString()}\n`;
  output += `## Mode: ${mode === 'vanilla_armor_stand' ? 'Vanilla Armor Stand (Hack)' : 'Display Entity (Add-on)'}\n`;
  output += `## Paste these commands into a function file (.mcfunction) or run them in a chain.\n\n`;

  blocks.forEach((block, index) => {
    const def = BLOCK_DEFINITIONS[block.type];
    const { position, rotation, scale, id } = block;
    
    // Unique tag for targeting this specific entity during setup
    const tag = `fmbe_${index}_${Math.floor(Math.random() * 1000)}`;

    output += `# --- Block ${index + 1}: ${def.name} ---\n`;

    if (mode === 'display_entity_addon') {
      // Logic for generic Display Entity Add-ons (e.g. Wiki.bedrock.dev style)
      // Usually: summon wiki:display_entity ~ ~ ~
      // Then event/tp to position
      
      output += `summon wiki:display_entity "${def.name}" ${formatFloat(position[0])} ${formatFloat(position[1])} ${formatFloat(position[2])}\n`;
      // We assume the entity spawns close enough to target with c=1 or we tag it immediately if possible.
      // Bedrock doesn't return UUID or allow easy tagging on summon without scripts.
      // So we summon at exact loc and try to tag closest.
      output += `tag @e[type=wiki:display_entity,c=1,r=0.5] add ${tag}\n`;
      
      // Set the block appearance
      // This syntax depends heavily on the specific add-on. 
      // Assuming a standard 'variant' or 'mark_variant' setup:
      output += `replaceitem entity @e[tag=${tag}] slot.mainhand 0 ${def.bedrockId}\n`;
      
      // Rotation
      output += `tp @e[tag=${tag}] ~ ~ ~ ${formatFloat(rotation[1])} ${formatFloat(rotation[0])}\n`;
      
      // Scale - Add-ons usually use an event or component
      if (scale[0] !== 1 || scale[1] !== 1 || scale[2] !== 1) {
         output += `# Note: Non-uniform scaling requires specific Add-on support. Using uniform scale based on X.\n`;
         output += `event entity @e[tag=${tag}] wiki:scale_${formatFloat(scale[0])}\n`;
      }

    } else {
      // VANILLA ARMOR STAND METHOD
      // This is the "Classic" FMBE method using vanilla commands.
      
      // 1. Summon Armor Stand
      output += `summon armor_stand "${def.name}" ${formatFloat(position[0])} ${formatFloat(position[1])} ${formatFloat(position[2])}\n`;
      
      // 2. Tag it to manipulate it
      output += `tag @e[type=armor_stand,c=1,name="${def.name}",r=1] add ${tag}\n`;
      
      // 3. Equip the block on head
      output += `replaceitem entity @e[tag=${tag}] slot.head 0 ${def.bedrockId}\n`;
      
      // 4. Rotate (Teleport in place)
      // Bedrock TP format: x y z y-rot x-rot
      output += `tp @e[tag=${tag}] ~ ~ ~ ${formatFloat(rotation[1])} ${formatFloat(rotation[0])}\n`;
      
      // 5. Make invisible
      output += `effect @e[tag=${tag}] invisibility 99999 1 true\n`;
      
      // 6. Scale (The PlayAnimation Hack)
      // Common hack: animation.ghast.scale or animation.creeper.swelling
      // This usually only supports uniform scaling.
      if (scale[0] !== 1) {
        // This is a pseudo-command representing the logic. 
        // Real command requires an animation controller in a resource pack OR the ghast hack.
        output += `playanimation @e[tag=${tag}] animation.ghast.scale root 99999 ${formatFloat(scale[0])}\n`;
      }
      
      // 7. Offset position for Center Pivot if necessary
      // Armor stands pivot at feet. If user wants center pivot, we'd adjust Y.
      // Ignoring for simplicity of 1-to-1 editor mapping.
    }
    
    output += `tag @e[tag=${tag}] remove ${tag}\n\n`;
  });

  return output;
};
