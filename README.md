# ⚡️ Energy Units

A modern, client-side web app to convert between common energy units accurately and quickly. This application is built with performance, privacy, and user experience in mind.

## Features

- **Single & Batch Conversions**: Convert single values or a whole list from text input or a file (`.csv`, `.txt`).
- **Comprehensive Unit Library**: Covers SI, electrical, thermal, mechanical, and atomic units.
- **Precision Control**: Choose between significant figures or fixed decimal places.
- **Advanced Rounding**: Select standard "half-up" or "banker's rounding".
- **Conversion History**: Quickly access and reuse your previous conversions.
- **Informative**: Detailed information and context for each unit.
- **Client-Side**: All calculations are done in your browser for maximum privacy and offline availability.
- **Modern UI**: A clean, responsive, and dark-mode-ready interface built with Tailwind CSS.

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Analytics**: Google Analytics (optional)

---

## Running Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (version 20.x or later recommended)
- npm (usually comes with Node.js)

### Installation & Startup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy). This command starts a live-reloading server, so any changes you make to the code will be visible in the browser immediately.

---

## Analytics

This project includes support for Google Analytics. To enable it:

1.  Open the `index.html` file.
2.  Find the Google Analytics script section in the `<head>`.
3.  Replace the placeholder `YOUR_GA_ID_HERE` with your actual Google Analytics Measurement ID (e.g., `G-XXXXXXXXXX`).

This replacement can be done manually or, more commonly, as part of an automated build or deployment process that injects the correct ID for different environments (development, production). Once the ID is in place, page views will be tracked automatically.

---

## The Build Process

When you're ready to create a production-ready version of the app, you run the build command.

```sh
npm run build
```

### What does this command do?

This command uses **Vite** (our build tool, configured in `vite.config.ts`) to perform several important tasks:

1.  **Transpilation**: It takes all the modern TypeScript (`.ts`, `.tsx`) and JavaScript code and converts it into a version that is compatible with a wide range of web browsers.
2.  **Bundling**: It intelligently combines all your JavaScript files and dependencies into a smaller number of optimized files. This reduces the number of network requests a browser needs to make, speeding up load times.
3.  **Minification**: It removes all unnecessary characters from the code (like whitespace, comments, and long variable names) without changing its functionality. This makes the file sizes significantly smaller.
4.  **Optimization**: It performs various other optimizations, like processing CSS files, to ensure the final application is as fast and efficient as possible.

### What new files are created?

After the build process is complete, a new directory named `dist` (short for "distribution") will be created in your project's root folder. This folder contains all the static files needed to run your application.

Inside `dist`, you will typically find:

-   `index.html`: An optimized version of your main HTML file, with scripts correctly linked.
-   `assets/`: A folder containing your bundled and minified JavaScript (e.g., `index-a1b2c3d4.js`) and CSS files. The filenames include a unique hash to prevent browser caching issues when you deploy new versions.

The contents of this `dist` folder are what you deploy to a web server or a service like GitHub Pages.

---

## Deployment to GitHub Pages

This project includes a GitHub Actions workflow for easy deployment to GitHub Pages.

1.  **Update `vite.config.ts`**:
    Open `vite.config.ts` and change the `base` property to match your GitHub repository name. For example, if your repository is `https://github.com/user/my-app`, the base should be `'/my-app/'`.

    ```ts
    // vite.config.ts
    export default defineConfig({
      // ...
      base: '/your-repo-name/',
    })
    ```

2.  **Push to `main`**:
    Commit and push your changes to the `main` branch.
    ```sh
    git push origin main
    ```
    The workflow defined in `.github/workflows/deploy.yml` will automatically run the `npm run build` command and deploy the contents of the resulting `dist` folder to your GitHub Pages site. The URL will be available in your repository's "Settings" > "Pages" section.

---

## Understanding the Imports in `index.html`

You might have noticed this section in the `index.html` file:

```html
<script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    ...
  }
}
</script>
```

### What is an `importmap`?

An **import map** is a modern browser feature that allows you to control how JavaScript modules are loaded. In our code (like `index.tsx`), we use simple import statements:

```javascript
import React from 'react';
```

Normally, a browser doesn't know what `"react"` means. This is where the import map comes in. It tells the browser: "Whenever you see an import for `'react'`, go and fetch the file from this specific URL: `https://aistudiocdn.com/react@^19.2.0`."

### What is `aistudiocdn.com`?

This URL points to a **Content Delivery Network (CDN)**. A CDN is a network of servers distributed globally that store and deliver web content.

Instead of bundling large libraries like React and ReactDOM into our own JavaScript files (which would make our files bigger), this setup loads them directly from a fast, specialized server.

**Advantages of this approach:**

1.  **Faster Load Times**: CDNs are highly optimized for speed.
2.  **Better Caching**: If you visit another website that also uses the same React version from the same CDN, your browser might not need to download it again because it's already in its cache.

This `importmap` setup is specific to the development environment where this app is being built. It's a modern and efficient way to handle dependencies without a local `node_modules` folder being served to the user.


