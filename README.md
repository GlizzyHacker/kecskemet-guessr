# Kecskemét Guessr

This project is based on a template created by the kir-dev team. The architecture is also inspired by their https://github.com/kir-dev/schbody project.

## Getting Started

### Prerequisites

- Node.js 22
- Pnpm 10

### Installation

You only need to install dependencies in the root directory.

```bash
pnpm install
```

### Linter and Formatter Configuration

It is a must to use ESLint and Prettier in this project.

Set up ESLint and Prettier in your IDE and check `fix on save` or `format on save` options.

You can run the following commands to check linting and formatting issues.

```bash
pnpm lint
# or
pnpm lint:fix
```

```bash
pnpm format:check
# or
pnpm format
```

### Development

You can run the backend and frontend separately.

```bash
pnpm start:backend # Starts on http://localhost:3001
```

```bash
pnpm start:frontend # Starts on http://localhost:3000
```

### After Development

You can build the frontend and run the application.

```bash
pnpm build:frontend
```

Or build the backend.

```bash
pnpm build:backend
```

There are recommended GitHub Actions workflows for this setup, which will fail if one of the following commands fails:

```bash
pnpm lint
```

```bash
pnpm format:check
```

```bash
pnpm build:backend
```

## Happy Coding!
