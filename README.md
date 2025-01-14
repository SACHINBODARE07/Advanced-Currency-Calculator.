# 1. Set up the backend

# Navigate to the project root directory
cd AdvancedCurrencyCalculator

# Install backend dependencies
npm install express mongoose cors axios xml2js

# Start MongoDB (make sure MongoDB is installed on your system)
# On Windows:
# "C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
# On macOS/Linux:
mongod

# Start the backend server
node server.js

# 2. Set up the frontend

# Open a new terminal window/tab

# Navigate to the project root directory (if not already there)
cd AdvancedCurrencyCalculator

# Create a new React app
npx create-react-app frontend

# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install axios bootstrap

# Replace the src folder with the provided React components

# Start the React development server
npm start
