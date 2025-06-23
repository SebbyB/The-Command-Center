# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run build:cpanel` - Build and copy .htaccess for cPanel deployment
- `npm run lint` - Run ESLint across the codebase
- `npm run preview` - Preview production build locally

## Architecture Overview

This is a React + TypeScript portfolio site built with Vite and Tailwind CSS, featuring a unique terminal-based navigation system with glassmorphism effects.

### Core Architecture Pattern

The application uses a **dual-layer overlay design**:

1. **Viewport Layer** (`src/components/Viewport.tsx`) - Full-screen background that renders different portfolio sections
2. **Terminal Overlay** (`src/App.tsx`) - Semi-transparent terminal positioned at bottom with glassmorphism effects

The terminal acts as the primary navigation interface, allowing users to navigate between portfolio sections using Unix-like commands.

### Key Components Structure

- **App.tsx** - Main orchestrator managing page transitions, terminal state, and animation controls
- **Viewport.tsx** - Section renderer with page transition animations (zoom, slide, fade effects)
- **Terminal.tsx** - Interactive command-line interface with command processing and terminal text animations
- **ResizableTerminal.tsx** - Terminal window controls (minimize/maximize functionality)

### Terminal Command System

The terminal implements a full command system with:
- Navigation commands: `about`, `projects`, `contact`, `skills`, `demo`, `home`
- Utility commands: `help`, `ls`, `cd`, `cat`, `echo`, `clear`, `whoami`
- Animation toggles: `animations` (terminal text effects), `pageanimations` (page transitions)

Commands are processed in `Terminal.tsx` with the `executeCommand` function and trigger viewport navigation via callback props.

### Animation System

Two independent animation systems:

1. **Terminal Animations** - Text entrance/exit effects for command output with staggered delays
2. **Page Animations** - Section transition effects (per-section custom animations: demo uses zoom+rotate, about uses fade+slide)

Both can be toggled independently via terminal commands and are controlled by state in App.tsx.

### Styling Architecture

- **Tailwind CSS** for component styling
- **CSS Custom Properties** in `index.css` for terminal theme colors and animation definitions
- **Glassmorphism Terminal** - Semi-transparent overlay with backdrop-filter blur effects
- **JetBrains Mono** font for terminal authenticity

### State Management Pattern

Uses React state lifted to App.tsx level for:
- `currentSection` - Active viewport content
- `pageAnimations` - Page transition toggle
- Terminal-specific state (animations, history) managed within Terminal.tsx
- Page transition orchestration via `isTransitioning` and `exitingSection` states

### Key Development Patterns

- Terminal commands use consistent `addLine()` pattern for output
- Page transitions use CSS classes applied conditionally based on section type
- Animation timing coordinated between exit (400ms) and entrance animations
- Terminal transparency achieved via rgba() backgrounds with backdrop-filter