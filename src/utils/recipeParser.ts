// Utility functions for parsing AI-generated recipe text
export interface ParsedRecipe {
  title: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
}

export function parseRecipeText(text: string): ParsedRecipe {
  const lines = text.split('\n').filter(line => line.trim());
  
  let title = 'Generated Recipe';
  let cookTime = '30 minutes';
  let servings = 4;
  let difficulty = 'Medium';
  const ingredients: string[] = [];
  const instructions: string[] = [];
  
  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Parse title
    if (trimmedLine.startsWith('Title:')) {
      title = trimmedLine.replace('Title:', '').trim();
      continue;
    }
    
    // Parse cook time
    if (trimmedLine.startsWith('Cook Time:') || trimmedLine.startsWith('Cooking Time:')) {
      cookTime = trimmedLine.replace(/Cook(?:ing)? Time:/, '').trim();
      continue;
    }
    
    // Parse servings
    if (trimmedLine.startsWith('Servings:')) {
      const servingsMatch = trimmedLine.match(/\d+/);
      if (servingsMatch) {
        servings = parseInt(servingsMatch[0]);
      }
      continue;
    }
    
    // Parse difficulty
    if (trimmedLine.startsWith('Difficulty:')) {
      difficulty = trimmedLine.replace('Difficulty:', '').trim();
      continue;
    }
    
    // Identify sections
    if (trimmedLine.toLowerCase().includes('ingredients')) {
      currentSection = 'ingredients';
      continue;
    }
    
    if (trimmedLine.toLowerCase().includes('instructions') || 
        trimmedLine.toLowerCase().includes('steps') ||
        trimmedLine.toLowerCase().includes('method')) {
      currentSection = 'instructions';
      continue;
    }
    
    // Parse ingredients
    if (currentSection === 'ingredients' && trimmedLine) {
      const cleanIngredient = trimmedLine.replace(/^[•\-\*\d+\.]\s*/, '').trim();
      if (cleanIngredient) {
        ingredients.push(cleanIngredient);
      }
    }
    
    // Parse instructions
    if (currentSection === 'instructions' && trimmedLine) {
      const cleanInstruction = trimmedLine.replace(/^\d+\.\s*/, '').trim();
      if (cleanInstruction) {
        instructions.push(cleanInstruction);
      }
    }
  }
  
  // Fallback if no ingredients or instructions found
  if (ingredients.length === 0) {
    ingredients.push('Ingredients will be generated based on your input');
  }
  
  if (instructions.length === 0) {
    instructions.push('Detailed cooking instructions will be provided');
  }
  
  return {
    title,
    cookTime,
    servings,
    difficulty,
    ingredients,
    instructions
  };
}