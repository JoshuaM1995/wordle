---
name: automated-test-writer
description: When the user requests that tests be written for the app.
tools: Bash, Glob, Grep, Read, Edit, Write, NotebookEdit, WebFetch, TodoWrite, WebSearch, BashOutput, KillShell, AskUserQuestion, Skill, SlashCommand, mcp__browsertools__getConsoleLogs, mcp__browsertools__getConsoleErrors, mcp__browsertools__getNetworkErrors, mcp__browsertools__getNetworkLogs, mcp__browsertools__takeScreenshot, mcp__browsertools__getSelectedElement, mcp__browsertools__wipeLogs, mcp__browsertools__runAccessibilityAudit, mcp__browsertools__runPerformanceAudit, mcp__browsertools__runSEOAudit, mcp__browsertools__runNextJSAudit, mcp__browsertools__runDebuggerMode, mcp__browsertools__runAuditMode, mcp__browsertools__runBestPracticesAudit, mcp__peekaboo__image, mcp__peekaboo__analyze, mcp__peekaboo__list, mcp__puppeteer__puppeteer_navigate, mcp__puppeteer__puppeteer_screenshot, mcp__puppeteer__puppeteer_click, mcp__puppeteer__puppeteer_fill, mcp__puppeteer__puppeteer_select, mcp__puppeteer__puppeteer_hover, mcp__puppeteer__puppeteer_evaluate, ListMcpResourcesTool, ReadMcpResourceTool
model: sonnet
---

# Instructions for Claude Code AI Agent: Writing Tests for Wordle Clone

## Project Overview
This is a React + TypeScript + Vite Wordle clone with the following key features:
- Game state management via `useGameState` hook
- Persistent state using localStorage
- Tile animations and confetti effects
- Virtual keyboard with visual feedback
- Dark mode toggle
- Toast notifications for user feedback

## Testing Framework Setup

### 1. Install Testing Dependencies
Add these packages to `package.json` devDependencies:

```json
{
  "devDependencies": {
    "@testing-library/react": "^16.0.1",
    "@testing-library/jest-dom": "^6.6.2",
    "@testing-library/user-event": "^14.5.2",
    "vitest": "^2.1.8",
    "@vitest/ui": "^2.1.8",
    "jsdom": "^25.0.1",
    "msw": "^2.6.8"
  }
}
```

### 2. Create Test Configuration Files

**vitest.config.ts** (add to root):
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
})
```

**src/test/setup.ts** (create new file):
```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

**Update package.json scripts**:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Test Structure and Organization

### Directory Structure
```
src/
├── test/
│   ├── setup.ts
│   ├── utils/
│   │   ├── test-utils.tsx
│   │   └── mock-data.ts
│   └── __mocks__/
│       └── @uidotdev-usehooks.ts
├── hooks/
│   └── __tests__/
│       └── useGameState.test.tsx
├── components/
│   ├── Game/
│   │   └── __tests__/
│   │       └── Game.test.tsx
│   ├── Tile/
│   │   └── __tests__/
│   │       └── Tile.test.tsx
│   ├── Keyboard/
│   │   └── __tests__/
│   │       └── Keyboard.test.tsx
│   └── DarkModeToggle/
│       └── __tests__/
│           └── DarkModeToggle.test.tsx
└── App/
    └── __tests__/
        └── App.test.tsx
```

## Testing Strategy by Component

### 1. Core Hook Testing (`useGameState.test.tsx`)

**Priority: HIGH** - This is the heart of the application logic.

**Test Cases:**
- **Initial state**: Verify correct initial values
- **Letter input**: Test adding letters to current guess
- **Backspace functionality**: Test removing letters
- **Word validation**: Test invalid words, too short words, duplicate words
- **Game win condition**: Test correct word submission
- **Game loss condition**: Test running out of guesses
- **Animation states**: Test `isAnimating`, `lastSubmittedRow` transitions
- **Confetti logic**: Test confetti timing and opacity changes
- **localStorage persistence**: Test state persistence across sessions
- **Edge cases**: Empty guesses, modifier keys, animation blocking

**Key Mock Requirements:**
- Mock `@uidotdev/usehooks` useLocalStorage
- Mock `react-hot-toast` toast function
- Mock timers for animation testing

### 2. Game Component Testing (`Game.test.tsx`)

**Priority: HIGH** - Main game container component.

**Test Cases:**
- **Rendering**: Verify game grid renders with correct number of rows/tiles
- **Tile props**: Test tile props are calculated correctly for each position
- **Win animations**: Test confetti appears on win
- **Loss state**: Test correct answer shows after loss
- **Development mode**: Test correct answer visibility in dev mode
- **Window size**: Test confetti uses correct dimensions
- **Animation timing**: Test correct answer appears after animations

**Key Mock Requirements:**
- Mock `useWindowSize` hook
- Mock `Confetti` component
- Mock environment variables

### 3. Tile Component Testing (`Tile.test.tsx`)

**Priority: MEDIUM** - Individual tile behavior.

**Test Cases:**
- **Empty tile**: Test empty state rendering
- **Letter display**: Test letter appears correctly
- **Pop-in animation**: Test letter entry animation
- **Flip animation**: Test tile flip on submission
- **Color states**: Test correct/incorrect/correct-position colors
- **Animation timing**: Test animation delays based on tile index
- **Animation completion**: Test `hasAnimated` state updates

### 4. Keyboard Component Testing (`Keyboard.test.tsx`)

**Priority: MEDIUM** - Virtual keyboard functionality.

**Test Cases:**
- **Key rendering**: Test all keys render correctly
- **Key states**: Test correct/incorrect/correct-position key colors
- **Click handlers**: Test virtual keyboard clicks trigger handleKeyPress
- **Key press animations**: Test pressed key visual feedback
- **Disabled state**: Test keyboard disabled during animations
- **Key state calculations**: Test key state logic with various guess patterns

### 5. DarkModeToggle Component Testing (`DarkModeToggle.test.tsx`)

**Priority: LOW** - Simple toggle component.

**Test Cases:**
- **Toggle functionality**: Test dark/light mode switching
- **localStorage persistence**: Test theme persistence
- **Icon changes**: Test icon updates based on theme
- **Initial state**: Test correct initial theme

### 6. App Component Testing (`App.test.tsx`)

**Priority: LOW** - Root component integration.

**Test Cases:**
- **Component rendering**: Test all main components render
- **Word selection**: Test random word selection
- **localStorage integration**: Test word persistence
- **Toast configuration**: Test toast styling

## Mock Setup Requirements

### 1. Create Mock Files

**src/test/__mocks__/@uidotdev-usehooks.ts**:
```typescript
export const useLocalStorage = vi.fn((key: string, defaultValue: any) => {
  const [value, setValue] = useState(defaultValue)
  return [value, setValue]
})

export const useWindowSize = vi.fn(() => ({
  width: 1024,
  height: 768
}))
```

**src/test/utils/test-utils.tsx**:
```typescript
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

**src/test/utils/mock-data.ts**:
```typescript
export const mockValidWords = ['apple', 'house', 'mouse', 'tiger', 'ocean']
export const mockWordleWords = ['apple', 'house', 'mouse']
export const mockCorrectWord = 'apple'
```

## Test Implementation Guidelines

### 1. Hook Testing Best Practices
- Use `renderHook` from `@testing-library/react` for custom hooks
- Mock external dependencies (localStorage, timers, toast)
- Test both happy path and edge cases
- Use `act()` for state updates
- Mock timers with `vi.useFakeTimers()` for animation tests

### 2. Component Testing Best Practices
- Test user interactions with `userEvent`
- Use `screen` queries for element selection
- Test accessibility with `getByRole`, `getByLabelText`
- Mock child components when testing parent logic
- Test both visual and behavioral aspects

### 3. Animation Testing
- Use `vi.useFakeTimers()` and `vi.advanceTimersByTime()`
- Test animation state transitions
- Verify cleanup of timers and effects
- Test animation blocking during user input

### 4. localStorage Testing
- Mock localStorage implementation
- Test persistence across component unmounts
- Test initial state from stored values
- Test state updates persist correctly

## Specific Test Scenarios

### Game Flow Testing
1. **Complete Win Scenario**:
   - User enters correct word
   - Confetti appears
   - Game state updates to won
   - Animations complete properly

2. **Complete Loss Scenario**:
   - User exhausts all guesses
   - Correct answer appears after animations
   - Game state prevents further input

3. **Invalid Input Handling**:
   - Too short words show "Too short!" toast
   - Invalid words show "Invalid word!" toast
   - Duplicate words show "You already guessed this word!" toast
   - Empty submission shows "Please add some letters!" toast

### Animation Testing
1. **Tile Flip Sequence**:
   - Tiles flip with staggered delays (250ms per tile)
   - Animation duration is 800ms per tile
   - Input blocked during animations
   - State updates after animation completion

2. **Confetti Animation**:
   - Confetti shows for 10 seconds
   - Fade out starts at 5 seconds
   - Opacity transitions smoothly
   - Confetti removed after 10 seconds

### Keyboard State Testing
1. **Key Color Logic**:
   - Correct letters: green
   - Correct position letters: yellow
   - Incorrect letters: gray
   - Unused letters: default color

2. **State Filtering**:
   - Exclude current row from key state calculations
   - Exclude animating row during animations
   - Include all rows when game is won

## Running Tests

### Commands
```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Test Coverage Goals
- **Statements**: >90%
- **Branches**: >85%
- **Functions**: >90%
- **Lines**: >90%

## File Naming Conventions
- Test files: `ComponentName.test.tsx`
- Mock files: `package-name.ts` in `__mocks__` directory
- Utility files: `utility-name.ts` in `test/utils`

## Testing Checklist

### Before Writing Tests
- [ ] Understand component/hook responsibilities
- [ ] Identify external dependencies to mock
- [ ] Plan test scenarios (happy path, edge cases, error cases)
- [ ] Set up proper mocks and test utilities

### During Test Writing
- [ ] Write descriptive test names
- [ ] Use proper assertions
- [ ] Test user interactions, not implementation details
- [ ] Clean up after each test
- [ ] Mock external dependencies appropriately

### After Writing Tests
- [ ] Verify tests pass
- [ ] Check test coverage
- [ ] Ensure tests are maintainable
- [ ] Document any complex test scenarios

## Common Testing Patterns

### Testing Custom Hooks
```typescript
import { renderHook, act } from '@testing-library/react'
import { useGameState } from '../useGameState'

test('should handle letter input', () => {
  const { result } = renderHook(() => useGameState('apple'))
  
  act(() => {
    result.current.handleKeyPress({ key: 'a', metaKey: false, ctrlKey: false })
  })
  
  expect(result.current.guesses[0]).toBe('a')
})
```

### Testing Components with Animations
```typescript
import { vi } from 'vitest'

test('should handle tile animations', () => {
  vi.useFakeTimers()
  
  render(<Tile shouldAnimate={true} />)
  
  // Advance timers to trigger animations
  vi.advanceTimersByTime(250)
  
  // Assert animation state
  expect(screen.getByTestId('tile')).toHaveClass('flip')
  
  vi.useRealTimers()
})
```

### Testing localStorage Integration
```typescript
test('should persist game state', () => {
  const mockSetItem = vi.spyOn(Storage.prototype, 'setItem')
  
  render(<Game correctWord="apple" />)
  
  // Trigger state change
  fireEvent.click(screen.getByText('a'))
  
  // Verify localStorage was called
  expect(mockSetItem).toHaveBeenCalledWith(
    'wordle.joshuamcnabb.guesses',
    expect.any(String)
  )
})
```

This comprehensive testing strategy will ensure the Wordle clone is thoroughly tested with high coverage and reliable test cases.
