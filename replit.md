# replit.md

## Overview

This is a Telegram bot wrapper for yt-dlp built with Node.js/Express backend and React frontend. The bot allows users to download media via Telegram by sending yt-dlp command arguments. The web frontend serves as a simple status page showing the bot's operational state.

**Core Purpose:**
- Accept `/dl <args>` commands via Telegram
- Execute yt-dlp safely with user-provided arguments
- Send downloaded files back to users (or report errors if Telegram rejects them)
- Clean up temporary files after each operation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend (Express + Telegram Bot)

**Server Entry Point:** `server/index.ts`
- Express server with JSON parsing and request logging
- HTTP server creation for both API routes and Vite dev middleware
- Development mode uses Vite for hot module replacement

**Bot Architecture:** `server/bot.ts`
- Uses grammy library for Telegram bot functionality
- Command-based interaction: `/start` for help, `/dl` for downloads
- Stateless design - no session storage or user tracking
- Downloads to temporary directory, sends to user, cleans up

**Security Layer:** `server/lib/validate.ts`
- Blocklist approach for dangerous yt-dlp flags
- Prevents shell injection by using spawn with argument arrays
- Forbidden flags include: `--exec`, `--proxy`, `--output`, `--cookies-from-browser`, etc.

**Argument Parsing:** `server/lib/parseArgs.ts`
- Custom CLI parser that respects quoted strings
- Handles escape characters properly
- Splits command string into safe argument array

**Download Handler:** `server/lib/ytdlp.ts`
- Spawns yt-dlp as child process with controlled arguments
- Forces output template to prevent path traversal
- Background cleanup job runs every 30 minutes

**Cleanup Utilities:** `server/lib/cleanup.ts`
- File-level cleanup for individual downloads
- Directory-level TTL-based cleanup for orphaned files

### Frontend (React + Vite)

**Purpose:** Simple status landing page (not a full application)

**Stack:**
- React 18 with TypeScript
- Vite for bundling with HMR in development
- TailwindCSS with shadcn/ui component library
- Framer Motion for animations
- TanStack Query for server state management
- Wouter for client-side routing

**Key Components:**
- `Home.tsx` - Status page showing bot operational state
- `StatusIndicator.tsx` - Animated status dot component
- Full shadcn/ui component library available in `components/ui/`

### Database (PostgreSQL + Drizzle)

**Schema:** `shared/schema.ts`
- Minimal schema - only a logs table exists
- Bot logic explicitly avoids database usage
- Drizzle ORM configured but database features are optional

**Configuration:** `drizzle.config.ts`
- PostgreSQL dialect
- Migrations output to `./migrations`
- Requires `DATABASE_URL` environment variable

### API Structure

**Routes:** `shared/routes.ts`
- Single endpoint: `GET /api/status` - returns `{ status: string }`
- Zod schemas for response validation

### Build System

**Development:** `npm run dev`
- Runs tsx directly for TypeScript execution
- Vite dev server with HMR for frontend

**Production:** `npm run build` + `npm start`
- Custom build script in `script/build.ts`
- esbuild for server bundling with selective dependency bundling
- Vite for frontend static build
- Output to `dist/` directory

## External Dependencies

### Required Environment Variables
- `BOT_TOKEN` - Telegram Bot API token (required for bot functionality)
- `DATABASE_URL` - PostgreSQL connection string (optional, warns if missing)
- `TMP_DIR` - Temporary download directory (defaults to `./tmp`)
- `YTDLP_PATH` - Path to yt-dlp binary (defaults to `yt-dlp`)
- `CLEANUP_TTL_MIN` - Minutes before orphaned files are cleaned (defaults to 30)

### External Services
- **Telegram Bot API** - via grammy library for bot communication
- **yt-dlp** - External binary, must be installed on system
- **PostgreSQL** - Optional database, used with connect-pg-simple for sessions if needed

### Key NPM Dependencies
- `grammy` - Telegram Bot framework
- `drizzle-orm` + `drizzle-kit` - Database ORM and migrations
- `@tanstack/react-query` - Server state management
- `tailwindcss` + Radix UI primitives - UI framework
- `framer-motion` - Animation library
- `zod` - Schema validation