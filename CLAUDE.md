# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Wordle clone built with React, TypeScript, and Vite. The game includes animations, dark mode, confetti on wins, and persistent game state via localStorage.

## Development Commands

### Setup
```bash
nvm use                # Switch to correct Node.js version (requires Node.js >=24.10.0)
pnpm install          # Install dependencies (use pnpm, not npm/yarn)
```

### Development
```bash
pnpm dev              # Start dev server on http://localhost:3000
pnpm build            # Build for production (runs TypeScript check then Vite build)
pnpm lint             # Lint codebase with ESLint
pnpm preview          # Preview production build
```

## Architecture

### State Management
- **Game state** is centralized in `useGameState` hook (src/hooks/useGameState.ts)
- **Persistence** via `useLocalStorage` hook from @uidotdev/usehooks
- All game state keys are defined in `LOCAL_STORAGE_KEYS` (src/constants/localstorage.ts)
- State includes: guesses, currentGuessIndex, correctWord, hasWonGame, darkMode

### Component Hierarchy
```
App (src/App.tsx)
├── Topbar (includes DarkModeToggle)
└── Game (src/components/Game/Game.tsx)
    ├── Tile components (rendered in grid)
    └── Keyboard
```

### Key Architectural Patterns

**Game Flow:**
1. Random word selected from `wordle-words.json` on app load and persisted to localStorage
2. User input handled by `useGameState.handleKeyPress` (keyboard events + virtual keyboard clicks)
3. Input validation checks: word length, valid word (from `valid-words.json`), no duplicates
4. On correct guess: triggers confetti animation with timed fade-out
5. On game loss: reveals correct answer after last tile flip animation completes

**Animation System:**
- Tile flips use staggered delays (250ms per tile) with 800ms flip duration
- `isAnimating` state blocks input during animations
- `lastSubmittedRow` tracks which row is currently animating
- Confetti shows for 10s with fade-out starting at 5s

**Keyboard State:**
- Keys change color based on letter status: correct (green), correct-position (yellow), incorrect (gray)
- Virtual keyboard mirrors physical keyboard state
- Key states recalculated when filtering out currently animating row to prevent premature color changes

### Styling
- SCSS with theme system using CSS custom properties
- Two themes: `[data-theme="light"]` and `[data-theme="dark"]`
- Theme variables defined in `src/styles/_theme.scss`
- Breakpoints in `src/styles/_breakpoints.scss`

### Word Lists
- `src/data/wordle-words.json`: Possible correct answers
- `src/data/valid-words.json`: All valid guessable words

## Configuration Notes

### Game Constants
Defined in `src/constants/game.ts`:
- `ROWS_PER_GAME = 6` (number of guesses)
- `TILES_PER_ROW = 5` (word length)

### Vite Config
- Dev server runs on port 3000 with `host: true` for network access
- React plugin enabled for Fast Refresh

### Development Mode Features
- Correct answer always visible when `import.meta.env.DEV` is true
- Production builds hide answer until game is lost