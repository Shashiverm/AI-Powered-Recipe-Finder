// MongoDB service for saving favorite recipes
// Note: This is a client-side mock implementation
// In production, this would connect to a backend API that handles MongoDB operations

export interface MongoRecipe {
  _id?: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: number;
  difficulty: string;
  createdAt: Date;
  userId?: string;
}

export class MongoDBService {
  private storageKey = 'recipeFinder_favorites';

  constructor() {
    // In a real implementation, this would initialize MongoDB connection
    console.log('MongoDB Service initialized (using localStorage for demo)');
  }

  async saveRecipe(recipe: Omit<MongoRecipe, '_id' | 'createdAt'>): Promise<MongoRecipe> {
    try {
      const savedRecipe: MongoRecipe = {
        ...recipe,
        _id: this.generateId(),
        createdAt: new Date(),
      };

      const existingRecipes = this.getStoredRecipes();
      const updatedRecipes = [...existingRecipes, savedRecipe];
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedRecipes));
      
      console.log('Recipe saved to MongoDB (localStorage):', savedRecipe.title);
      return savedRecipe;
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw new Error('Failed to save recipe');
    }
  }

  async getFavoriteRecipes(): Promise<MongoRecipe[]> {
    try {
      return this.getStoredRecipes();
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    }
  }

  async deleteRecipe(id: string): Promise<boolean> {
    try {
      const existingRecipes = this.getStoredRecipes();
      const filteredRecipes = existingRecipes.filter(recipe => recipe._id !== id);
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredRecipes));
      
      console.log('Recipe deleted from MongoDB (localStorage):', id);
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      return false;
    }
  }

  async searchRecipes(query: string): Promise<MongoRecipe[]> {
    try {
      const allRecipes = this.getStoredRecipes();
      const lowercaseQuery = query.toLowerCase();
      
      return allRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(lowercaseQuery) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(lowercaseQuery)
        )
      );
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  }

  private getStoredRecipes(): MongoRecipe[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing stored recipes:', error);
      return [];
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const mongoService = new MongoDBService();