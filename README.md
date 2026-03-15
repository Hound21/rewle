# Rewle

Daily REWE price guessing game built with React + Vite + TypeScript.

## Local development

Requirements:

- Node.js 20+
- npm 10+

Install and start:

```sh
npm install
npm run dev
```

The app runs on `http://localhost:8080`.

## Available scripts

- `npm run dev` — start local development server
- `npm run build` — create production build in `dist/`
- `npm run preview` — preview production build locally
- `npm run test` — run Vitest tests
- `npm run lint` — run ESLint

## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. Install Pages deploy tooling:

	```sh
	npm install -D gh-pages
	```

3. Add this to `package.json`:

	- `"homepage": "https://<your-github-username>.github.io/<your-repo-name>/"`
	- script: `"predeploy": "npm run build"`
	- script: `"deploy": "gh-pages -d dist"`

4. If deploying under a repo path (not a custom domain), set Vite base path in `vite.config.ts`:

	```ts
	export default defineConfig({
	  base: "/<your-repo-name>/",
	});
	```

5. Deploy:

	```sh
	npm run deploy
	```

6. In GitHub repo settings, open **Pages** and verify source is the `gh-pages` branch.
