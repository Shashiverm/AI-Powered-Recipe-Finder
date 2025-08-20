# 🍳 AI-Powered Recipe Finder

An interactive **AI cooking assistant** where users can enter ingredients they already have and get **AI-generated recipe suggestions**. The app integrates **Hugging Face models** for recipe generation and **MongoDB** for storing favorites.

## 🎯 Aim
To help users quickly find creative meal ideas based on available ingredients using **AI text generation**.

---

## 🛠 Tech Stack

- **Frontend:** React + Vite, TypeScript, CSS
- **Database:** MongoDB (store favorites) - Currently using localStorage for demo
- **AI Model:** Hugging Face (Text Generation - GPT-2 or similar)

---

## ⚡ How It Works

1. User enters ingredients (e.g., *"pasta, tomato, cheese"*)
2. The app sends this input to a Hugging Face model via API
3. AI responds with a **recipe idea** including steps & ingredients
4. User can **save favorite recipes** in MongoDB (localStorage for demo)

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/ai-powered-recipe-finder.git
cd ai-powered-recipe-finder
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Setup environment variables
Create a `.env` file in the root directory:
```env
VITE_HF_API_KEY=your_huggingface_api_key
VITE_MONGO_URI=your_mongodb_connection_string
```

**To get your Hugging Face API key:**
1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up/Login to your account
3. Go to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy the token and add it to your `.env` file

### 4️⃣ Run the development server
```bash
npm run dev
```

### 5️⃣ Build for production
```bash
npm run build
```

---

## 🌟 Features

### Current Features
- ✅ Modern React + TypeScript setup
- ✅ Vite for fast development
- ✅ AI-powered recipe generation via Hugging Face API
- ✅ Save favorite recipes (localStorage)
- ✅ Search through saved recipes
- ✅ Responsive design
- ✅ Clean, intuitive UI
- ✅ Fast recipe suggestions
- ✅ Error handling and loading states

### Planned Features
- 🔄 Real MongoDB integration
- 🔄 User authentication
- 🔄 Recipe sharing
- 🔄 Nutritional information
- 🔄 Meal planning

---

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "lucide-react": "^0.263.1",
  "mongodb": "^6.3.0",
  "dotenv": "^16.3.1"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@vitejs/plugin-react": "^4.2.1",
  "typescript": "^5.2.2",
  "vite": "^5.0.8"
}
```

---

## 🔧 API Integration

### Hugging Face API
The app uses Hugging Face's Inference API for text generation:

```typescript
const response = await fetch(
  "https://api-inference.huggingface.co/models/gpt2",
  {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      inputs: `Create a recipe using these ingredients: ${ingredients}...`,
      parameters: {
        max_length: 500,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9,
      }
    }),
  }
);
```

### MongoDB Integration
Currently using localStorage for demo purposes. Production version will use MongoDB:

```javascript
// Future MongoDB integration
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("recipeFinder");
const recipes = db.collection("favorites");

await recipes.insertOne({ 
  title: "Cheesy Tomato Pasta", 
  ingredients: ["tomato", "cheese", "pasta"], 
  steps: ["Boil pasta", "Cook sauce", "Mix & serve"],
  createdAt: new Date()
});
```

---

## 📂 Project Structure
```
ai-powered-recipe-finder/
├── .env.example                 # Environment variables template
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── src/
    ├── main.tsx                 # App entry point
    ├── App.tsx                  # Main app component
    ├── App.css                  # App styles
    ├── index.css                # Global styles
    ├── vite-env.d.ts           # Vite type definitions
    ├── services/
    │   ├── huggingface.ts      # Hugging Face API service
    │   └── mongodb.ts          # MongoDB service (localStorage for demo)
    └── utils/
        └── recipeParser.ts     # Recipe text parsing utilities
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ✨ Final Output

This is a fully functional **AI-powered recipe generator** where users can:
- 🥗 Input ingredients they already have
- 🤖 Get AI-suggested recipes instantly via Hugging Face API
- ❤️ Save favorite recipes for later
- 🔍 Browse through their recipe collection
- 📱 Use on any device with responsive design
- ⚡ Experience fast, intelligent recipe suggestions

---

*Happy Cooking! 🍳✨*