# AGENTS.md

## Working directory

All app code and commands live in `math-game-learning/`. Run `cd math-game-learning` before any dev commands.

## Commands

```bash
cd math-game-learning
npm install       # install deps
npm run dev       # dev server on :3000, auto-opens browser
npm run build     # production build → dist/
npm run preview   # preview build locally
```

No test runner, linter, or formatter is configured yet.

## Stack

- **Vue 3** (Composition API, `<script setup>`) + **Vite 5**
- **Phaser.js 3** (game engine, devDependency)
- **Pinia** (state management)
- **LocalStorage** (save data)
- Plain JavaScript (`"type": "module"`), no TypeScript

## Architecture

- `src/main.js` → mounts `App.vue` → renders `components/GameApp.vue`
- `src/scenes/` — Phaser game scenes (battle, map, etc.)
- `src/store/` — Pinia stores (one per domain: battle, shop, settings, etc.)
- `src/config/` — static game data (grades, monsters, questions, achievements, etc.)
- `src/models/` — data models
- `src/components/` — Vue UI components
- `src/utils/` — helper functions
- `vite.config.js` — `base: './'` for relative asset paths (GitHub Pages compatible)

## OpenSpec

This repo uses the `openspec` spec-driven workflow. Changes live under `openspec/changes/`. Use the `openspec-*` skills to propose, apply, and archive changes.

## Conventions

- UI text and README are in Chinese (zh-CN)
- No `.env` loading convention; config lives in `src/config/*.js`
- Responsive design for PC + mobile
