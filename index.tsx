// This is the main entry point for the React application.
// Think of it as the "start" button for the entire user interface.

// Import React and ReactDOM, which are the core libraries for building the user interface.
import React from 'react';
import ReactDOM from 'react-dom/client';
// Import the main App component, which is the root of our component tree.
import App from './App';

// Find the HTML element with the id 'root' in the index.html file.
// This is the container where our entire React application will be placed.
const rootElement = document.getElementById('root');
if (!rootElement) {
  // If for some reason the 'root' element doesn't exist, we can't start the app, so throw an error.
  throw new Error("Could not find root element to mount to");
}

// Create a "root" for the React application. This is the modern way to initialize a React app.
// It allows React to manage the content of the `rootElement`.
const root = ReactDOM.createRoot(rootElement);

// Render the main App component into the root.
// <React.StrictMode> is a wrapper that helps find potential problems in the app during development.
// It doesn't affect the production build.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
