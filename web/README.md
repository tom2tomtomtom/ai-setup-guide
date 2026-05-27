# Guided setup wizard

Source for the friendly guided walkthrough of the AI Setup Guide.

Lives at **[setup.aiden.services](https://setup.aiden.services)**. Free, no signup, no tracking.

## Self-host

Clone the parent repo and run:

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:5173`. The full wizard works locally with no env vars, no API keys, no backend. Progress lives in your browser's localStorage.

## Build for production

```bash
npm run build
npm run preview  # local preview of the production build
```

The build outputs to `dist/`. Any static host can serve it.

## Tech

- Vite + React 18 + TypeScript
- Tailwind CSS + Inter font
- Zustand for state (persisted to localStorage)
- React Router for routing
- Lucide icons
- react-markdown for step content

## What it does

1. Diagnostic quiz (7 questions, under 2 minutes) figures out the user's starting point on the 8-milestone ladder.
2. Wizard walks them through each step with copy-to-clipboard commands, OS-aware variants, expected output, and per-step common errors.
3. Stuck panel at every step generates a paste-ready help prompt the user can drop into Claude.
4. Self-Onboarding Prompt screen delivers the final super-prompt that bootstraps the user's vault from their real Gmail, Calendar, and Drive.
5. Resume on return picks up where the user left off if it's been more than an hour since their last touch.

## Content lives in code

All wizard content is in `src/content/`:

- `milestones.ts`: the 8 milestones with typed steps, commands (OS variants), checklists
- `quiz.ts`: 7 questions and the scoring function that picks a recommended milestone
- `selfOnboardingPrompt.ts`: the super-prompt text

Edit those files, the wizard updates. No DB, no CMS.

## Voice rules

No em-dashes. Reassuring not patronising. Direct.

## License

CC BY 4.0. Same as the parent repo.
