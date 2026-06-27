# Frontend Architecture Guide

## Layering

- `App.tsx`: page composition only, avoid business details.
- `components/layout/*`: global shell widgets (nav/footer).
- `components/*`: cross-feature reusable UI blocks.
- `features/<feature-name>/*`: feature-local state, constants, helpers, and UI.

## Component Boundaries

- Keep UI-focused components mostly presentational.
- Put async state and side effects in hooks (for example `useHeroChat`).
- Move static copy/config out of component files into constants.
- If a component grows beyond ~150 lines, split by responsibility.

## Naming Conventions

- `*Section`: page-level section containers.
- `*Panel` / `*List`: reusable blocks inside a section.
- `use*`: side-effect or state orchestration hooks.
- `types.ts`: feature-local domain types.

## Practical Guardrails

- Prefer one-way data flow from section to leaf components.
- Keep language and theme variations centralized in constants/helpers.
- Avoid inline parsing/business logic inside render trees.
- Add tests around hooks and helpers first when behavior changes.
