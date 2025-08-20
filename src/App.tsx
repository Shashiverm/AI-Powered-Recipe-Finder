import React, { useState, useEffect } from 'react';
import { Heart, ChefHat, Search, BookOpen, Trash2, Clock, Users, Loader2 } from 'lucide-react';
import { HuggingFaceService } from './services/huggingface';
import { mongoService, MongoRecipe } from './services/mongodb';
import { parseRecipeText, ParsedRecipe } from './utils/recipeParser';
import './App.css';

interface Recipe extends ParsedRecipe {
  id: string;
  createdAt: Date;
}

interface SavedRecipe extends Recipe {
  isFavorite: boolean;
}

const RecipeFinderApp: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'favorites'>('generate');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const huggingFaceService = new HuggingFaceService();

  // Load saved recipes from MongoDB on component mount
  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      const recipes = await mongoService.getFavoriteRecipes();
      const savedRecipesWithFavorite = recipes.map(recipe => ({
        id: recipe._id || '',
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        createdAt: recipe.createdAt,
        isFavorite: true
      }));
      setSavedRecipes(savedRecipesWithFavorite);
    } catch (error) {
      console.error('Error loading saved recipes:', error);
    }
  };

  // Generate recipe using Hugging Face API
  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Call Hugging Face API
      const recipeText = await huggingFaceService.generateRecipe(ingredients);
      
      // Parse the generated text
      const parsedRecipe = parseRecipeText(recipeText);
      
      // Create recipe object
      const recipe: Recipe = {
        id: Date.now().toString(),
        ...parsedRecipe,
        createdAt: new Date()
      };

      setGeneratedRecipe(recipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
    try {
      await mongoService.saveRecipe({
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty
      });

      const savedRecipe: SavedRecipe = {
        ...recipe,
        isFavorite: true
      };
      
      setSavedRecipes(prev => {
        const exists = prev.find(r => r.id === recipe.id);
        if (exists) return prev;
        return [...prev, savedRecipe];
      });

      // Show success message
      setError(null);
    } catch (error) {
      console.error('Error saving recipe:', error);
      setError('Failed to save recipe. Please try again.');
    }
  };

  const removeRecipe = async (id: string) => {
    try {
      const success = await mongoService.deleteRecipe(id);
      if (success) {
        setSavedRecipes(prev => prev.filter(recipe => recipe.id !== id));
      }
    } catch (error) {
      console.error('Error removing recipe:', error);
      setError('Failed to remove recipe. Please try again.');
    }
  };

  const filteredRecipes = savedRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.ingredients.some(ingredient => 
      ingredient.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const RecipeCard: React.FC<{ 
    recipe: Recipe; 
    isSaved?: boolean; 
    onSave?: () => void; 
    onRemove?: () => void 
  }> = ({ recipe, isSaved = false, onSave, onRemove }) => (
    <div className="recipe-card">
      <div className="recipe-header">
        <h3>{recipe.title}</h3>
        <div className="recipe-meta">
          <span className="meta-item">
            <Clock size={16} />
            {recipe.cookTime}
          </span>
          <span className="meta-item">
            <Users size={16} />
            {recipe.servings} servings
          </span>
          <span className={`difficulty ${recipe.difficulty.toLowerCase()}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="recipe-content">
        <div className="ingredients-section">
          <h4>Ingredients:</h4>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="instructions-section">
          <h4>Instructions:</h4>
          <ol className="instructions-list">
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="recipe-actions">
        {!isSaved && onSave && (
          <button className="save-btn" onClick={onSave}>
            <Heart size={16} />
            Save Recipe
          </button>
        )}
        {isSaved && onRemove && (
          <button className="remove-btn" onClick={onRemove}>
            <Trash2 size={16} />
            Remove
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <ChefHat size={32} />
            <h1>🍳 AI Recipe Finder</h1>
          </div>
          <nav className="nav-tabs">
            <button 
              className={`tab ${activeTab === 'generate' ? 'active' : ''}`}
              onClick={() => setActiveTab('generate')}
            >
              <Search size={20} />
              Generate Recipe
            </button>
            <button 
              className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              <BookOpen size={20} />
              My Recipes ({savedRecipes.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="generate-section">
            <div className="input-section">
              <h2>🤖 What ingredients do you have?</h2>
              <p className="subtitle">
                Enter ingredients separated by commas and let AI create amazing recipes for you!
              </p>
              <div className="input-group">
                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g., chicken, broccoli, rice, garlic, onion"
                  className="ingredients-input"
                  onKeyPress={(e) => e.key === 'Enter' && !isGenerating && generateRecipe()}
                />
                <button 
                  onClick={generateRecipe} 
                  disabled={isGenerating || !ingredients.trim()}
                  className="generate-btn"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="spinning" />
                      Generating...
                    </>
                  ) : (
                    '🚀 Generate Recipe'
                  )}
                </button>
              </div>
              <div className="api-status">
                {import.meta.env.VITE_HF_API_KEY ? (
                  <p className="api-connected">✅ Connected to Hugging Face AI</p>
                ) : (
                  <p className="api-demo">🔧 Demo mode - Add VITE_HF_API_KEY for real AI generation</p>
                )}
              </div>
            </div>

            {isGenerating && (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>🤖 AI is analyzing your ingredients and creating the perfect recipe...</p>
                <p className="loading-subtext">This may take a few moments</p>
              </div>
            )}

            {generatedRecipe && !isGenerating && (
              <div className="result-section">
                <h2>🎉 Your AI-Generated Recipe</h2>
                <RecipeCard 
                  recipe={generatedRecipe} 
                  onSave={() => saveRecipe(generatedRecipe)}
                  isSaved={savedRecipes.some(r => r.id === generatedRecipe.id)}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-section">
            <div className="favorites-header">
              <h2>❤️ My Saved Recipes</h2>
              {savedRecipes.length > 0 && (
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              )}
            </div>

            {filteredRecipes.length === 0 ? (
              <div className="empty-state">
                {savedRecipes.length === 0 ? (
                  <>
                    <ChefHat size={64} className="empty-icon" />
                    <h3>No recipes saved yet</h3>
                    <p>Generate your first AI recipe and save it to see it here!</p>
                    <button 
                      className="cta-button"
                      onClick={() => setActiveTab('generate')}
                    >
                      🚀 Generate Your First Recipe
                    </button>
                  </>
                ) : (
                  <>
                    <Search size={64} className="empty-icon" />
                    <h3>No recipes found</h3>
                    <p>Try a different search term</p>
                  </>
                )}
              </div>
            ) : (
              <div className="recipes-grid">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isSaved={true}
                    onRemove={() => removeRecipe(recipe.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default RecipeFinderApp;