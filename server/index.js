const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routes import 
const boardRoutes = require('./routes/boardRoutes');
const todoRoutes = require('./routes/todoRoutes');
const projectRoutes = require('./routes/projectRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const Ticket = require('./models/Ticket'); 

const app = express();

// --- DYNAMIC CORS SETUP ---
// Ye logic local aur production dono ko handle karega
const allowedOrigins = [
  'http://localhost:3000', // Local development
  process.env.FRONTEND_URL  // Hosting URL (jo tum .env mein daloge)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// MongoDB Connection 
// process.env se URI lega, jo local aur host dono jagah set karni hogi
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

app.get('/', (req, res) => {
  res.send("TaskVault API is Active");
});

// PORT Handling: Hosting platforms automatically set process.env.PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server node active on port ${PORT}`));