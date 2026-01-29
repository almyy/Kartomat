# Roomy - Classroom Seating Solver

A 100% client-side web application that solves classroom seating arrangements using Constraint Satisfaction Problem (CSP) techniques.

## Features

- **Add Students**: Enter student names to create your classroom roster
- **Configure Classroom**: Set the number of rows and columns for your seating chart
- **Define Constraints**: Add three types of constraints:
  - **Not Together**: Two students should not sit adjacent to each other
  - **Must Be Together**: Two students must sit adjacent to each other
  - **Must Be In Row**: A student must be placed in a specific row
- **Solve**: Uses a backtracking CSP algorithm to find valid seating arrangements
- **Visualize**: See the resulting seating chart with an intuitive grid layout

## Technology Stack

- **React 19** - Modern UI framework
- **Vite 7** - Fast build tool and dev server
- **CSP Solver** - Custom backtracking algorithm for constraint satisfaction

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or higher)
- npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173/` when running the dev server.

## How It Works

The application uses a backtracking algorithm to solve the Constraint Satisfaction Problem:

1. Students are assigned to seats one at a time
2. After each assignment, all constraints are checked
3. If a constraint is violated, the algorithm backtracks and tries a different seat
4. If all students are successfully placed, the solution is displayed
5. If no valid solution exists, an error message is shown

## Architecture

- `src/App.jsx` - Main React component with UI and state management
- `src/cspSolver.js` - CSP solving logic with backtracking algorithm
- `src/App.css` - Styling for the application
- `index.html` - Entry point HTML file

## License

MIT
