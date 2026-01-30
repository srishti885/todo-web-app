# TASKVAULT - ADVANCED TASK MANAGEMENT ARCHITECTURE

### LIVE PROJECT LINK
[View Live Application](https://todo-web-app-srishti885.vercel.app)

### PROJECT DESCRIPTION
TaskVault is a high-performance full-stack web application designed for seamless task orchestration. It features a zero-knowledge architecture with a focus on speed, security, and real-time data synchronization. The system allows users to manage multiple project boards and nested tasks through a secure, responsive interface integrated with Artificial Intelligence for smart task decomposition.

## CORE FEATURES
* User Authentication: Secure login and signup via Firebase with Google OAuth support.
* AI Task Intelligence: Integration with Hugging Face Inference API (Llama models) to suggest contextual tasks and generate logical sub-tasks based on board category.
* Multi-Board System: Capability to create and categorize tasks into different organizational boards.
* Full CRUD Operations: Users can Create, Read, Update, and Delete both boards and individual tasks.
* Persistence: All data is stored in MongoDB Atlas ensuring data availability across sessions.
* Dynamic UI: Responsive dashboard with glassmorphism design and custom CSS animations.
* Security: Protected routes and encrypted key handling for user privacy using environment variables.

## TECH STACK
* Frontend: React.js with Tailwind CSS and Lucide Icons.
* Backend: Node.js and Express.js framework.
* Database: MongoDB for structured task storage.
* AI Engine: Hugging Face Inference API for natural language task generation.
* Authentication: Firebase Auth (Email and Google).
* Styling: Custom CSS animations and Glassmorphic components.

## APPLICATION WORKFLOW

### PHASE 1: INITIALIZATION AND AUTHENTICATION
The system initiates authentication through manual entry or OAuth 2.0 (Google Sync). Once authenticated, the Firebase Auth state triggers a redirect to the main Dashboard environment.

### PHASE 2: AI-POWERED TASK DECOMPOSITION
When a task is created, the system interfaces with the Hugging Face AI Engine. The backend sends the task context to the AI model, which returns a structured set of sub-tasks relevant to the specific board. Tasks are managed through an 'isSubTask' boolean logic for clean hierarchy.

### PHASE 3: DATA NODE SYNCHRONIZATION
The backend verifies user identity and fetches specific boards from the MongoDB cluster. The state manager in React populates the UI with real-time data nodes.

### PHASE 4: BOARD AND TASK MANAGEMENT (CRUD)
* Create Node: User initializes a new board via POST request.
* Task Deployment: Users append tasks within boards managed through PUT/POST operations.
* Update/Modify: Real-time synchronization of task descriptions and completion status.
* Termination: DELETE requests remove data from the persistent storage layer.

## INSTALLATION AND SETUP
1. Clone the repository.
2. Server Setup: cd server, npm install, npm start.
3. Client Setup: cd client, npm install, npm run dev.

## ENVIRONMENT VARIABLES
Configure the following in your environment vault:

Frontend: VITE_FIREBASE_API_KEY, VITE_FIREBASE_PROJECT_ID, VITE_BACKEND_URL_PROD
Backend: MONGO_URI, HF_TOKEN, FRONTEND_URL

## SECURITY AND GIT PRACTICES
Sensitive Data Protection: Environment vaults and Firebase secret keys are explicitly excluded via a .gitignore strategy to maintain security.
