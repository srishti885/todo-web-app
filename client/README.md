#### TASKVAULT - ADVANCED TASK MANAGEMENT ARCHITECTURE
### PROJECT DESCRIPTION
TaskVault is a high-performance full-stack web application designed for seamless task orchestration. It features a zero-knowledge architecture with a focus on speed, security, and real-time data synchronization. The system allows users to manage multiple project boards and nested tasks through a secure, responsive interface integrated with Artificial Intelligence for smart task decomposition.

## CORE FEATURES
User Authentication: Secure login and signup via Firebase with Google OAuth support.

AI Task Intelligence: Integration with Hugging Face Inference API (Llama models) to suggest contextual tasks and generate logical sub-tasks based on board category.

Multi-Board System: Capability to create and categorize tasks into different organizational boards.

Full CRUD Operations: Users can Create, Read, Update, and Delete both boards and individual tasks.

Persistence: All data is stored in MongoDB Atlas ensuring data availability across sessions.

Dynamic UI: Responsive dashboard with high-end glassmorphism design and custom CSS animations.

Security: Protected routes and encrypted key handling for user privacy using environment variables.

## TECH STACK
Frontend: React.js with Tailwind CSS and Lucide Icons.

Backend: Node.js and Express.js framework.

Database: MongoDB for structured task storage.

AI Engine: Hugging Face Inference API for natural language task generation.

Authentication: Firebase Auth (Email and Google).

Styling: Custom CSS animations and Glassmorphic components.

## APPLICATION WORKFLOW
The application follows a logical progression from initialization to data persistence:

# PHASE 1: INITIALIZATION AND AUTHENTICATION
The system initiates authentication through two primary vectors: Manual Entry: Users utilize credentials to establish a secure session. OAuth 2.0: Users can opt for Google Sync to bypass manual entry. Once authenticated, the Firebase Auth state triggers a redirect to the main Dashboard environment.

# PHASE 2: AI-POWERED TASK DECOMPOSITION
When a task is created, the system can interface with the Hugging Face AI Engine: The backend sends the task context to the AI model. The AI returns a structured set of sub-tasks relevant to the specific board (e.g., Study, Gym, or Work). Tasks are marked with an 'isSubTask' boolean to maintain visual hierarchy without hardcoded symbols.

# PHASE 3: DATA NODE SYNCHRONIZATION
Upon entering the Dashboard, the system executes a GET request to the Node.js backend: The backend verifies user identity and fetches specific boards from the MongoDB cluster. The state manager in React populates the UI with real-time data nodes.

# PHASE 4: BOARD AND TASK MANAGEMENT (CRUD)
Create Node: User initializes a new board via POST request. Task Deployment: Users append tasks within boards managed through PUT/POST operations. Update/Modify: Real-time synchronization of task descriptions and completion status. Termination: DELETE requests remove data from the persistent storage layer.

## ADAPTIVE ENVIRONMENT CONFIGURATION
The backend is architected to be environment-agnostic, allowing it to switch between local and production modes dynamically: The server utilizes process.env.PORT for cloud hosting and defaults to 5000 for local development. Security headers are generated based on a whitelist strategy, permitting localhost during development and the FRONTEND_URL in production.

## INSTALLATION AND SETUP
Clone the repository.

Server Setup: cd server, npm install, npm start.

Client Setup: cd client, npm install, npm run dev.

## ENVIRONMENT VARIABLES
Configure the following in your environment vault:

Backend: PORT, MONGO_URI, HF_TOKEN, FRONTEND_URL

Frontend: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_BACKEND_URL_PROD

## SECURITY AND GIT PRACTICES
Sensitive Data Protection: Environment vaults and Firebase secret keys are explicitly excluded via a .gitignore strategy. Dependency Management: Node modules and build artifacts are ignored to maintain a clean version control history.