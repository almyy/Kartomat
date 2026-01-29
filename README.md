# Kartomat - Classroom Seating Solver

A 100% client-side web application that solves classroom seating arrangements using Constraint Satisfaction Problem (CSP) techniques.

## Features

- **Add Students**: Enter student names to create your classroom roster
- **Configure Classroom**: Set the number of rows and columns for your seating chart
- **Define Constraints**: Add five types of constraints:
  - **Not Together**: Two students should not sit adjacent to each other
  - **Must Be Together**: Two students must sit adjacent to each other
  - **Must Be In Row**: A student must be placed in a specific row
  - **Far Apart**: Two students must sit at least a specified distance apart (using Euclidean distance)
  - **Absolute Placement**: A student must be placed at a specific seat (row and column) - a hard requirement
- **Solve**: Uses a backtracking CSP algorithm to find valid seating arrangements
- **Visualize**: See the resulting seating chart with an intuitive grid layout

## Technology Stack

- **React 19** - Modern UI framework
- **Vite 7** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **Zustand** - Lightweight state management
- **i18next** - Internationalization support
- **CSP Solver** - Custom backtracking algorithm with MCV heuristic
- **Vitest** - Fast unit testing framework
- **Playwright** - End-to-end testing framework

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher)
- pnpm (managed via corepack)

### Installation

This project uses **pnpm** as its package manager. The project is configured with corepack to automatically use the correct version.

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

**Note:** This project enforces the use of pnpm (via `only-allow` in preinstall script). If you try to use npm or yarn, you will see an error message. Additionally, the project implements a 1-week security cooldown (`minimumReleaseAge` in `pnpm-workspace.yaml`) for new packages to protect against supply chain attacks.

### Development

The app will be available at `http://localhost:5173/` when running the dev server.

### Testing

This project uses two testing frameworks:

- **Vitest** - Fast unit tests for algorithms and business logic
- **Playwright** - E2E tests for user workflows and UI

```bash
# Run unit tests
pnpm test:unit:run

# Run E2E tests
pnpm test

# Run unit tests in watch mode
pnpm test:unit

# Run E2E tests with UI
pnpm test:ui
```

See [TESTING.md](./TESTING.md) for detailed testing guide.

## How It Works

The application uses an optimized backtracking algorithm with the Most Constrained Variable (MCV) heuristic to solve the Constraint Satisfaction Problem:

1. **Smart Student Selection**: Students with the most constraints are placed first
2. **Efficient Position Search**: Only valid positions are considered based on constraints
3. **Constraint Checking**: After each assignment, all constraints are validated
4. **Backtracking**: If a constraint is violated, try a different seat
5. **Solution Display**: If all students are successfully placed, the solution is shown
6. **Error Handling**: If no valid solution exists, an error message is displayed

### Performance Optimizations

The solver uses several techniques to handle complex scenarios efficiently:
- **Absolute constraints**: Placed first with only 1 valid position
- **Together constraints**: Partners placed immediately adjacent to each other
- **Row constraints**: Only positions in the specified row are considered
- **MCV heuristic**: Most constrained students are prioritized

This allows the solver to handle even complex scenarios (26 students with multiple constraints) in milliseconds instead of hanging indefinitely.

## Architecture

- `src/App.jsx` - Main React component with UI and state management
- `src/cspSolver.js` - CSP solving logic with backtracking algorithm
- `src/App.css` - Styling for the application
- `index.html` - Entry point HTML file

## License

MIT
