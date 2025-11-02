# Google Calendar Clone

A high-fidelity Google Calendar clone built with Next.js 15, featuring Google OAuth authentication and multi-user support.

## 🚀 Quick Start

### Prerequisites

-   Docker & Docker Compose
-   Google OAuth credentials - https://console.cloud.google.com/apis/credentials

### Setup

#### 1. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Generate AUTH_SECRET
openssl rand -base64 32

# Edit .env.local and add your credentials:
```

**Important for Docker:** Also copy to `.env` for Docker Compose:

```bash
cp .env.local .env
```

#### 2. Start with Docker

```bash
docker-compose up -d
```

This will:

-   Start PostgreSQL database
-   Build and run the Next.js app on port 3000
-   Initialize the database schema

#### 3. Access the App

Open http://localhost:3000 and sign in with Google!

## 🛠️ Development Mode

For local development without Docker:

```bash
# Install dependencies
npm install

# Start PostgreSQL only
docker-compose up -d postgres

# Run development server
npm run dev
```


## ✨ Features

- Google OAuth authentication
- Multi-user support with data isolation
- Month, Week, and Day views
- Create, edit, delete events
- Drag-and-drop event scheduling
- Responsive design
- PostgreSQL database with Docker
