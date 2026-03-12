# Repository Guidelines

## Project Structure & Module Organization
This project is a single Next.js App Router application. Route files live in `app/`, including the dashboard, bean entry pages, grinder pages, search, shared layout, and server actions. Reusable UI components live in `components/`. Data access and business logic live in `lib/`, including the SQLite connection, Drizzle schema, queries, uploads, utilities, and Zod validators. Local data is stored in `data/`; uploaded bean photos are written to `data/uploads/`. Keep generated output such as `.next/` and `node_modules/` out of commits.

## Build, Test, and Development Commands
- `npm run dev`: start the local development server.
- `npm run build`: create a production build and catch type/runtime integration issues.
- `npm run start`: run the production build locally.
- `npm run lint`: run ESLint across the repository.
- `npm test`: currently aliases `npm run lint`.
- `npm run db:generate`: generate Drizzle artifacts after schema changes.

## Coding Style & Naming Conventions
Use TypeScript with strict typing and functional React components. Follow the existing style: 2-space indentation, double quotes, semicolons, and named exports for shared helpers. Keep route files in `app/**/page.tsx`, server actions in `app/actions.ts`, and shared logic in `lib/*.ts`. Use descriptive camelCase for variables/functions, PascalCase for components, and kebab-free folder names that match Next.js routing needs.

## Testing Guidelines
There is no dedicated test runner yet. Before opening a change, run `npm run lint` and `npm run build`. For data-model changes, also verify the SQLite migration path in `lib/db.ts` and manually test the affected flows in the browser, especially bean creation, grinder creation, search, and image upload. When adding automated tests later, place them alongside the feature or under a top-level `tests/` directory with `*.test.ts` naming.

## Commit & Pull Request Guidelines
Git history is not available in this workspace, so no repository-specific commit convention can be inferred yet. Use short imperative commit messages such as `Add grinder creation flow` or `Store explicit bean log date`. Pull requests should summarize user-visible changes, list validation steps (`npm run lint`, `npm run build`), and include screenshots for UI updates on both desktop and mobile-width layouts.

## Data & Configuration Notes
Treat `data/coffee-log.sqlite` and `data/uploads/` as local development state, not source files. Avoid committing personal coffee logs or uploaded photos. If configuration expands later, document new environment variables near the feature that requires them.
