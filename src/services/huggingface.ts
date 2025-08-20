// Hugging Face API service for recipe generation
export interface HuggingFaceResponse {
  generated_text: string;
}

export class HuggingFaceService {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models';

  constructor() {
    this.apiKey = import.meta.env.VITE_HF_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Hugging Face API key not found. Using mock responses.');
    }
  }

  async generateRecipe(ingredients: string): Promise<string> {
    if (!this.apiKey) {
      return this.getMockRecipe(ingredients);
    }

    try {
      const prompt = `Create a detailed recipe using these ingredients: ${ingredients}. 

Please provide:
- Recipe title
- Cooking time
- Servings
- Difficulty level (Easy/Medium/Hard)
- Complete ingredient list with measurements
- Step-by-step cooking instructions

Recipe:`;

      const response = await fetch(`${this.baseUrl}/gpt2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 500,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HuggingFaceResponse[] = await response.json();
      return data[0]?.generated_text || this.getMockRecipe(ingredients);
    } catch (error) {
      console.error('Error calling Hugging Face API:', error);
      return this.getMockRecipe(ingredients);
    }
  }

  private getMockRecipe(ingredients: string): string {
    const ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i);
    const mainIngredient = ingredientList[0] || 'mixed ingredients';
    
    const mockRecipes = [
      {
        title: `Delicious ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Stir Fry`,
        cookTime: '15 minutes',
        servings: 4,
        difficulty: 'Easy',
        ingredients: [
          `2 cups ${mainIngredient}`,
          ...ingredientList.slice(1).map(ing => `1 cup ${ing}`),
          '2 tbsp olive oil',
          '2 cloves garlic, minced',
          'Salt and pepper to taste',
          '1 tbsp soy sauce'
        ],
        instructions: [
          'Heat olive oil in a large pan or wok over medium-high heat',
          'Add minced garlic and cook for 30 seconds until fragrant',
          `Add ${ingredientList.join(', ')} and stir-fry for 5-7 minutes`,
          'Season with salt, pepper, and soy sauce',
          'Cook for another 2-3 minutes until everything is well combined',
          'Serve hot over rice or noodles',
          'Garnish with fresh herbs if desired'
        ]
      },
      {
        title: `Creamy ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Pasta`,
        cookTime: '25 minutes',
        servings: 4,
        difficulty: 'Medium',
        ingredients: [
          '12 oz pasta of choice',
          `2 cups ${mainIngredient}`,
          ...ingredientList.slice(1).map(ing => `1 cup ${ing}`),
          '1 cup heavy cream',
          '1/2 cup parmesan cheese, grated',
          '3 cloves garlic, minced',
          '2 tbsp butter',
          'Salt and pepper to taste'
        ],
        instructions: [
          'Cook pasta according to package instructions until al dente',
          'In a large skillet, melt butter over medium heat',
          'Add garlic and cook until fragrant, about 1 minute',
          `Add ${ingredientList.join(', ')} and cook for 5-6 minutes`,
          'Pour in heavy cream and bring to a gentle simmer',
          'Add cooked pasta and toss to combine',
          'Stir in parmesan cheese until melted',
          'Season with salt and pepper',
          'Serve immediately with extra cheese if desired'
        ]
      },
      {
        title: `Hearty ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Soup`,
        cookTime: '35 minutes',
        servings: 6,
        difficulty: 'Easy',
        ingredients: [
          `3 cups ${mainIngredient}, chopped`,
          ...ingredientList.slice(1).map(ing => `2 cups ${ing}, diced`),
          '6 cups vegetable or chicken broth',
          '1 onion, diced',
          '2 carrots, sliced',
          '2 celery stalks, chopped',
          '3 cloves garlic, minced',
          '2 tbsp olive oil',
          '1 tsp dried herbs (thyme, oregano)',
          'Salt and pepper to taste'
        ],
        instructions: [
          'Heat olive oil in a large pot over medium heat',
          'Add onion, carrots, and celery. Cook for 5 minutes until softened',
          'Add garlic and cook for another minute',
          `Add ${ingredientList.join(', ')} and cook for 5 minutes`,
          'Pour in broth and bring to a boil',
          'Reduce heat and simmer for 20-25 minutes',
          'Season with herbs, salt, and pepper',
          'Taste and adjust seasoning as needed',
          'Serve hot with crusty bread'
        ]
      }
    ];

    const selectedRecipe = mockRecipes[Math.floor(Math.random() * mockRecipes.length)];
    
    return `Title: ${selectedRecipe.title}
Cook Time: ${selectedRecipe.cookTime}
Servings: ${selectedRecipe.servings}
Difficulty: ${selectedRecipe.difficulty}

Ingredients:
${selectedRecipe.ingredients.map(ing => `• ${ing}`).join('\n')}

Instructions:
${selectedRecipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}`;
  }
}