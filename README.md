# AISL Web

**AISL Web** is a comprehensive web application designed for **Admin** and **Staff** to efficiently manage lockers and locker-related operations. It provides a modern, responsive interface for monitoring locker status, managing user access, and handling administrative tasks.

## Features

- **Admin Dashboard**: Overview of system statistics, locker usage, and user activity.
- **Locker Management**: View, assign, and manage lockers. Monitor locker status (available, occupied, maintenance).
- **Staff Interface**: Tools for staff to assist users and perform daily operational tasks.
- **User Management**: Manage admin and staff accounts and permissions.

## Tech Stack

This project is built using a modern frontend stack:

- **Framework**: [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (based on Radix UI)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **API Integration**: RESTful API
- **Form Handling**: React Hook Form + Zod validation

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd aisl-web
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

### Build for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Project Structure

```text
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
│   └── ui/          # Shadcn UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and libraries
│   └── store/       # Redux store configuration
├── generated/       # Generated types (if any)
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality.
- `npm run preview`: Previews the production build locally.

---
