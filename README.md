# MagnitudeMesh | Global Seismic Command Center

MagnitudeMesh is a real-time, 3D visualization platform for global seismic activity. It combines a robust, self-healing data ingestion pipeline with a high-performance web interface to track, analyze, and visualize earthquakes as they happen.

![MagnitudeMesh Banner](https://raw.githubusercontent.com/Teseife/MagnitudeMesh/master/web/public/globe.svg)

## 🌍 Overview

This project provides a complete end-to-end solution for seismic monitoring:
1.  **Data Ingestion:** A Python-based pipeline that continuously fetches earthquake data from the USGS API, cleans/normalizes it, and stores it in a Supabase database.
2.  **Visualization:** A Next.js web application featuring an interactive 3D globe (CesiumJS) that visualizes earthquake magnitude, depth, and impact zones in real-time.

## ✨ Key Features

### 🖥️ Web Interface (Frontend)
-   **Interactive 3D Globe:** Built with CesiumJS/Resium for high-fidelity rendering.
-   **Real-time Visualization:** Earthquakes are rendered as points with size (magnitude) and color (depth) coding.
-   **Magnitude Feed:** A slide-out panel showing a tabular feed of the last 24 hours of seismic activity.
-   **Impact Zones:** Visualizes the estimated "felt radius" of earthquakes on the globe surface.
-   **Filtering:** Filter events by Year and Magnitude Range (Low, Medium, High).
-   **Demo Mode:** Built-in simulation modes to test UI error handling (Database Down, Network Error, WebGL Crash, Empty Feed).
-   **Responsive Design:** Fully responsive UI with glassmorphism aesthetics.

### ⚙️ Data Pipeline (Backend)
-   **Data-Driven Ingestion:** The ingestor automatically checks the database for the last recorded event and fetches only missing data.
-   **Self-Healing:** If the pipeline goes down for hours or days, it automatically detects the gap and backfills missing data on the next run.
-   **Cron Automation:** Scheduled via GitHub Actions to run hourly.
-   **Data Normalization:** Flattens complex GeoJSON from USGS into a structured SQL schema.
-   **Upsert Logic:** Handles updates to existing events (e.g., magnitude revisions) without creating duplicates.

## 🏗️ Architecture & Workflows

### 1. Ingestion Workflow (`ingestor/`)
*   **Trigger:** GitHub Action (`ingest_cron.yaml`) runs hourly.
*   **Check State:** Script queries Supabase for `MAX(incident_time_est)`.
*   **Fetch Delta:** Queries USGS API for all events from `last_db_time` to `now`.
*   **Transform:** Cleans data, filters ocean events (optional), and flattens JSON.
*   **Store:** Upserts data into Supabase `earthquakes` table.

### 2. Web Application (`web/`)
*   **Frontend:** Next.js 16 (App Router) + TypeScript.
*   **State Management:** React Hooks for filters, globe camera, and data selection.
*   **Visualization:** Resium (React wrapper for CesiumJS).
*   **Styling:** Tailwind CSS + Framer Motion for UI animations.
*   **Deployment:** Automatically deployed to Vercel on git push.

## 🛠️ Tech Stack

*   **Frontend:** Next.js 16, TypeScript, CesiumJS, Resium, Tailwind CSS, Framer Motion
*   **Backend/Scripting:** Python 3.9, Requests, Pandas (optional)
*   **Database:** Supabase (PostgreSQL)
*   **CI/CD:** GitHub Actions, Vercel
*   **Testing:** Vitest

## 🚀 Getting Started

### Prerequisites
-   Node.js 20+
-   Python 3.9+
-   Supabase Account
-   Cesium Ion Token (free)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Teseife/MagnitudeMesh.git
    cd MagnitudeMesh
    ```

2.  **Setup Web Client**
    ```bash
    cd web
    npm install
    
    # Create .env file
    echo "NEXT_PUBLIC_SUPABASE_URL=your_url" > .env
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" >> .env
    echo "NEXT_PUBLIC_CESIUM_TOKEN=your_token" >> .env
    
    npm run dev
    ```

3.  **Setup Ingestor (Local Run)**
    ```bash
    cd ingestor
    pip install -r requirements.txt
    
    # Run a manual backfill
    python main.py backfill --start 2024-01-01 --end 2024-01-31
    ```

## 🧪 Testing

The project includes unit tests for utility functions and visualization logic.
```bash
cd web
npm run test
```

## 📜 License

This project is open-source and available under the MIT License.
