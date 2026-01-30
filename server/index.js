const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { HfInference } = require('@huggingface/inference'); // Official SDK use kiya
require('dotenv').config();

// Routes import 
const boardRoutes = require('./routes/boardRoutes');
const todoRoutes = require('./routes/todoRoutes');
const projectRoutes = require('./routes/projectRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const Ticket = require('./models/Ticket'); 

const app = express();

// SDK Initialize (Using your existing token)
const hf = new HfInference(process.env.HF_TOKEN);

// DYNAMIC CORS SETUP 
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'http://localhost:5173', // Vite default port
  process.env.FRONTEND_URL  // Hosting URL 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("Database Connection Error: ", err));

// API Routes
app.use('/api/boards', boardRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/projects', projectRoutes); 
app.use('/api/settings', settingsRoutes);

// Ticket API Endpoint
app.post('/api/tickets', async (req, res) => {
  try {
    const { name, email, issue } = req.body;
    const newTicket = new Ticket({ name, email, issue });
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ message: "Error saving ticket", error });
  }
});

// 2. AI SUGGESTIONS ENDPOINT (OFFICIAL SDK VERSION - STABLE)
app.post('/api/ai/suggest', async (req, res) => {
  const { boardTitle, currentTask } = req.body;

  // Swapped Order: Llama is currently more stable than Mistral Nemo
  const models = [
    "meta-llama/Llama-3.2-3B-Instruct",
    "mistralai/Mistral-Nemo-Instruct-2407"
  ];

  for (let modelName of models) {
    try {
      const response = await hf.chatCompletion({
        model: modelName,
        messages: [
          { 
            role: "user", 
            content: `Context: Board "${boardTitle}". User typing: "${currentTask}". Suggest 3 very short, 2-word todo completions. Return only comma separated values.` 
          }
        ],
        max_tokens: 25,
      });

      const output = response.choices[0].message.content;
      if (output) {
        const suggestions = output.split(',').map(s => s.trim().replace(/[".\n*]/g, '')).slice(0, 3);
        console.log(`Success with: ${modelName}`);
        return res.json({ suggestions });
      }
    } catch (error) {
      console.error(`AI SDK Error with ${modelName}:`, error.message);
    }
  }

  res.json({ suggestions: ["Update task", "Check status", "Finish now"] });
});

app.get('/', (req, res) => {
  res.send("TaskVault API is Active");
});

// PORT Handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server node active on port ${PORT}`));