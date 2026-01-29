#### TASKVAULT - ADVANCED TASK MANAGEMENT ARCHITECTURE
### PROJECT DESCRIPTION
TaskVault is a high-performance full-stack web application designed for seamless task orchestration. It features a zero-knowledge architecture with a focus on speed, security, and real-time data synchronization. The system allows users to manage multiple project boards and nested tasks through a secure, responsive interface.

## CORE FEATURES
User Authentication: Secure login and signup via Firebase with Google OAuth support.

Multi-Board System: Capability to create and categorize tasks into different organizational boards.

Full CRUD Operations: Users can Create, Read, Update, and Delete both boards and individual tasks.

Persistence: All data is stored in MongoDB Atlas ensuring data availability across sessions.

Dynamic UI: Responsive dashboard with high-end glassmorphism design and custom CSS animations.

Security: Protected routes and encrypted key handling for user privacy.

Ticket System: Integrated API endpoint for reporting technical issues or feedback.

## TECH STACK
Frontend: React.js with Tailwind CSS and Lucide Icons.

Backend: Node.js and Express.js framework.

Database: MongoDB for structured task storage.

Authentication: Firebase Auth (Email and Google).

Styling: Custom CSS animations and Glassmorphic components.

## APPLICATION WORKFLOW
The application follows a logical progression from initialization to data persistence:

# PHASE 1: INITIALIZATION AND AUTHENTICATION
The workflow begins at the TaskVault Landing Interface. The system initiates authentication through two primary vectors:

Manual Entry: Users utilize the pre-configured credentials (t@gmail.com / 1234abc@q) to establish a link.

OAuth 2.0: Users can opt for Google Biometric Sync to bypass manual key entry.

Once authenticated, the Firebase Auth state triggers a redirect to the main Dashboard environment.

# PHASE 2: DATA NODE SYNCHRONIZATION
Upon entering the Dashboard, the system executes a GET request to the Node.js backend:

The backend verifies the user identity and fetches specific boards associated with that account from the MongoDB cluster.

The state manager in React populates the UI with real-time data nodes.

# PHASE 3: BOARD AND TASK MANAGEMENT (CRUD)
Users interact with the system through the following operational flow:

Create Node: User initializes a new board. A POST request is sent to the server, creating a new document in the boards collection.

Task Deployment: Within a specific board, users can append tasks. Each task is an object within the board array, managed through PUT operations.

Update/Modify: Users can edit task descriptions or toggle completion status, triggering immediate synchronization with the database.

Termination: Deleting a task or board sends a DELETE request to the API, clearing the data from the persistent storage layer.

# ADAPTIVE ENVIRONMENT CONFIGURATION
The backend is architected to be environment-agnostic, allowing it to switch between local and production modes dynamically:

# PORT RESOLUTION
The server utilizes 'process.env.PORT' to interface with cloud hosting providers while defaulting to port 5000 for local development cycles.

# DYNAMIC CORS POLICY
Security headers are generated based on a whitelist strategy. The system permits 'localhost:3000' during active development and switches to the 'FRONTEND_URL' specified in the environment vault upon deployment.

## INSTALLATION AND SETUP
Clone the repository to your local system.

Navigate to the server directory: cd server npm install npm start

Navigate to the client directory: cd client npm install npm start

## ENVIRONMENT VARIABLES
Configure the following in a .env file within the server directory:

PORT = 5000

MONGO_URI = your_mongodb_connection_string

FRONTEND_URL = your_deployed_frontend_url

## AUTHENTICATION CREDENTIALS
For manual testing and evaluation, use the following identifiers:

# Identifier: t@gmail.com

# Encryption Key: 1234abc@q

## SECURITY AND GIT PRACTICES
The repository follows strict data exclusion policies:

Sensitive Data Protection: Environment vaults and Firebase secret keys are explicitly excluded via a multi-tier .gitignore strategy.

Dependency Management: Node modules and build artifacts are ignored to maintain a clean version control history.