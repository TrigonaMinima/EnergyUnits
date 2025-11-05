# ⚡️ Energy Unit Converter

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

## Running Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (version 20.x or later recommended)
- npm (usually comes with Node.js)

### Installation & Startup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/TrigonaMinima/EnergyUnits.git
    cd EnergyUnits
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Deployment

This project includes a GitHub Actions workflow for easy deployment to GitHub Pages. Commit and push your changes to the `main` branch.

```sh
git push origin main
```

The workflow defined in `.github/workflows/deploy.yml` will automatically build the project and deploy it to your GitHub Pages site. The URL will be available in your repository's "Settings" > "Pages" section.

## Contributing

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

