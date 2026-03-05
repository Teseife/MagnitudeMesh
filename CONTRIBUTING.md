# Contributing to MagnitudeMesh

Thank you for your interest in contributing to MagnitudeMesh! We welcome contributions of all kinds — bug fixes, new features, documentation improvements, and more. This guide will help you get up and running quickly.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Prerequisites](#prerequisites)
3. [Running the Web App](#running-the-web-app)
4. [Running the Ingestor](#running-the-ingestor)
5. [Running Tests](#running-tests)
6. [Pull Request Guidelines](#pull-request-guidelines)
7. [Reporting Issues](#reporting-issues)
8. [Code Style](#code-style)
9. [License](#license)

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/MagnitudeMesh.git
   cd MagnitudeMesh
   ```
3. Follow the setup steps below for the component(s) you want to work on.

For a full overview of the project structure and architecture, see the [README](README.md).

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 20+** — for the web frontend
- **Python 3.9+** — for the data ingestor
- **Supabase account** — required for database connectivity
- **Cesium Ion token** — required for 3D globe rendering (free tier available at [cesium.com](https://cesium.com/ion/))

---

## Running the Web App

```bash
cd web
npm install

# Create a .env file with your credentials
echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" > .env
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key" >> .env
echo "NEXT_PUBLIC_CESIUM_TOKEN=your_cesium_token" >> .env

npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Running the Ingestor

```bash
cd ingestor
pip install -r requirements.txt
python main.py
```

To run a manual backfill over a date range:
```bash
python main.py backfill --start 2024-01-01 --end 2024-01-31
```

---

## Running Tests

The web app has a Vitest-based test suite. To run it:

```bash
cd web
npm run test
```

Please ensure all existing tests pass before submitting a pull request.

---

## Pull Request Guidelines

- **Create a feature branch** from `main` for your changes:
  ```bash
  git checkout -b feature/my-new-feature
  ```
- **Write descriptive PR titles** that clearly explain what the change does (e.g., `feat: add magnitude filter slider` or `fix: correct depth color mapping`).
- **Keep PRs focused** — one logical change per PR makes review faster and easier.
- Reference any relevant GitHub Issues in your PR description (e.g., `Closes #42`).
- Make sure the test suite passes before requesting review.

---

## Reporting Issues

We use [GitHub Issues](https://github.com/Teseife/MagnitudeMesh/issues) to track bugs and feature requests.

When reporting a **bug**, please include:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Your environment (OS, Node.js version, browser, etc.)
- Any relevant screenshots or error messages

For **feature requests**, describe the use case and the value it would add to the project.

---

## Code Style

- **Frontend (TypeScript/React):** Follow the patterns already established in the `web/src/` directory. The project uses ESLint — run `cd web && npm run lint` to check for style issues.
- **Backend (Python):** Follow the patterns in the `ingestor/` directory. Keep functions small and focused.
- Avoid introducing new dependencies unless absolutely necessary — discuss in an issue first.

---

## License

By contributing to MagnitudeMesh, you agree that your contributions will be licensed under the [MIT License](LICENSE) that covers this project.
