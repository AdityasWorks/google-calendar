# Google Calendar Clone

A full-stack calendar application built with Next.js 15, featuring Google OAuth authentication, multi-user support, and comprehensive event management capabilities.

## Features

- Google OAuth authentication with NextAuth.js v5
- Multi-user support with isolated data
- Multiple calendar views: Month, Week, Day
- Event creation, editing, and deletion
- Drag-and-drop event rescheduling
- All-day event support
- Event color customization
- Responsive design with Tailwind CSS
- PostgreSQL database with Docker support
- RESTful API architecture

## Technology Stack

### Frontend
- **Next.js 15**: App Router with React Server Components for optimal performance
- **React 19**: Latest features including hooks and context API
- **TypeScript**: Type safety across the entire codebase
- **Tailwind CSS**: Utility-first styling with custom components

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **PostgreSQL**: Relational database for structured data storage
- **pg (node-postgres)**: Direct database connection pooling

### Authentication
- **NextAuth.js v5**: Modern authentication solution
- **JWT Strategy**: Edge Runtime compatible sessions
- **Google OAuth Provider**: Secure third-party authentication

### Infrastructure
- **Docker & Docker Compose**: Containerized development and deployment
- **Vercel**: Production hosting platform
- **Neon/Vercel Postgres**: Managed PostgreSQL for production

## Architecture

### Authentication Flow

The application uses NextAuth.js v5 with a JWT-based session strategy optimized for Edge Runtime compatibility:

1. User initiates sign-in through Google OAuth
2. NextAuth.js handles the OAuth flow and creates a JWT token
3. User data is synchronized to PostgreSQL via `/api/sync-user` endpoint
4. Middleware protects routes by validating JWT tokens
5. User session persists across requests through secure HTTP-only cookies

This architecture separates authentication (Edge Runtime) from database operations (Node.js Runtime) for optimal performance.

### Database Schema

**Users Table**
- `id`: TEXT UUID (primary key)
- `email`: Unique identifier from Google OAuth
- `name`, `image`: User profile information
- `created_at`: Timestamp for user registration

**Events Table**
- `id`: Serial primary key
- `user_id`: Foreign key to users table (CASCADE delete)
- `title`, `description`, `location`: Event details
- `start_time`, `end_time`: TIMESTAMP for event scheduling
- `color`: HEX color code for visual distinction
- `is_all_day`: Boolean flag for all-day events
- `recurrence_rule`: TEXT for future recurring event support
- Indexes on `user_id`, `start_time`, and `end_time` for query optimization

### API Design

RESTful endpoints following standard HTTP conventions:

- `GET /api/events` - Retrieve user's events with optional date filtering
- `POST /api/events` - Create new event with validation
- `PUT /api/events/[id]` - Update existing event
- `DELETE /api/events/[id]` - Remove event

All endpoints validate user authentication and enforce data isolation per user.

### State Management

- **CalendarContext**: React Context API for global calendar state
- **Custom Hooks**: `useKeyboardShortcuts`, `useToast` for reusable logic
- **Server Components**: Default for data fetching and static content
- **Client Components**: Interactive calendar views and forms

## Business Logic

### Event Validation

- Start time must be before end time
- All-day events automatically set to midnight-to-midnight
- Required fields: title, start_time, end_time
- Optional fields: description, location, color
- Server-side validation prevents invalid data persistence

### User Data Isolation

- All database queries filter by authenticated user_id
- Foreign key constraints ensure referential integrity
- CASCADE delete removes user events when user account is deleted
- Middleware prevents unauthorized access to protected routes

### Edge Cases Handled

**Time Zones**
- All times stored in IST in database
- Client-side conversion to local timezone for display
- ISO 8601 format for date serialization

**Concurrent Edits**
- Optimistic UI updates for responsive feel
- Server-side validation as source of truth
- Error handling with user feedback via toast notifications

**Empty States**
- Graceful handling of no events
- Helpful UI prompts for first-time users
- Loading states during data fetching

**Error Scenarios**
- Network failures with retry mechanisms
- Invalid form submissions with specific error messages
- Authentication failures redirect to sign-in
- Database connection pooling with error logging

## Animations and Interactions

### Implemented Interactions

**Drag-and-Drop**
- Events can be dragged to different time slots
- Visual feedback during drag operation
- Automatic time calculation based on drop position
- Week and day views support drag rescheduling

**Keyboard Shortcuts**
- `T` - Go to Today
- `C` - Create new event
- `1` - Switch to Day view
- `2` - Switch to Week view
- `3` - Switch to Month view
- `←/→` - Navigate to previous/next period
- Custom `useKeyboardShortcuts` hook implementation
- Focus management for modal dialogs

**Visual Feedback**
- Toast notifications for user actions (success/error states)
- Loading spinners during async operations
- Skeleton loaders for initial page load
- Hover states on interactive elements

**Responsive Behavior**
- Mobile-first design approach
- Touch-friendly controls on mobile devices
- Adaptive layouts for different screen sizes
- Collapsible navigation on smaller screens

### CSS Transitions

- Smooth modal open/close animations
- Fade-in effects for toast notifications
- Hover transitions on buttons and cards
- Custom Tailwind animations for loading states

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/AdityasWorks/google-calendar.git
cd google-calendar
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```
DATABASE_URL=postgresql://calendar_user:calendar_pass@localhost:5432/calendar_db
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_GOOGLE_ID=<your-google-client-id>
AUTH_GOOGLE_SECRET=<your-google-client-secret>
NEXTAUTH_URL=http://localhost:3000
```

4. **Configure Google OAuth**
- Go to Google Cloud Console
- Create OAuth 2.0 Client ID
- Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
- Add authorized JavaScript origin: `http://localhost:3000`

5. **Start PostgreSQL**
```bash
docker-compose up -d postgres
```

6. **Initialize database**
```bash
docker exec -i google-calendar-postgres psql -U calendar_user -d calendar_db < app/lib/db.sql
```

7. **Run development server**
```bash
npm run dev
```

8. **Access application**
Open http://localhost:3000

### Docker Deployment

1. **Copy environment variables**
```bash
cp .env.local .env
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Access application**
Open http://localhost:3000


## License

MIT License - See LICENSE file for details
