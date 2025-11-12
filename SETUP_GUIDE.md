# Complete Frontend Setup Guide

This guide contains all the files you need to add to complete the frontend for your Smarter.codes assignment.

## Files to Create

I've started by adding `frontend/pages/index.tsx` (already committed). Below are all remaining files needed:

---

## 1. frontend/components/SearchForm.tsx

```typescript
import { FormEvent } from 'react';

interface SearchFormProps {
  url: string;
  query: string;
  loading: boolean;
  onUrlChange: (url: string) => void;
  onQueryChange: (query: string) => void;
  onSubmit: (e: FormEvent) => void;
  onClear: () => void;
}

export default function SearchForm({
  url,
  query,
  loading,
  onUrlChange,
  onQueryChange,
  onSubmit,
  onClear
}: SearchFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com/page"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter the URL of the webpage you want to search
          </p>
        </div>

        {/* Query Input */}
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            Search Query
          </label>
          <input
            id="query"
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="machine learning algorithms"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={loading}
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter keywords or phrases to search for semantically
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !url || !query}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'Search'
            )}
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 disabled:opacity-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## 2. frontend/components/ResultsList.tsx

```typescript
import { SearchResult } from '../pages/index';

interface ResultsListProps {
  results: SearchResult[];
}

export default function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-700">No results found. Try a different query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                {idx + 1}
              </span>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Chunk:</span> {result.chunk.start} - {result.chunk.end}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-700">
                Similarity:
              </div>
              <div className="flex items-center">
                <div className="w-16 bg-gray-200 rounded-full h-2.5 mr-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(result.score * 100).toFixed(0)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {(result.score * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-3">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {result.chunk.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 3. frontend/package.json

```json
{
  "name": "semantic-html-search-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2"
  }
}
```

---

## 4. frontend/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## 5. frontend/next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
```

---

## 6. frontend/tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 7. frontend/postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## 8. frontend/styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
```

---

## 9. frontend/pages/_app.tsx

```typescript
import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

---

## 10. frontend/.env.local.example

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 11. frontend/README.md

```markdown
# Frontend - Semantic HTML Search

Next.js frontend for the semantic HTML search engine.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
npm start
```
```

---

## Quick Setup Commands

Run these commands from your repository root:

```bash
# Create component files
mkdir -p frontend/components
touch frontend/components/SearchForm.tsx
touch frontend/components/ResultsList.tsx

# Create configuration files
touch frontend/package.json
touch frontend/tsconfig.json
touch frontend/next.config.js
touch frontend/tailwind.config.js
touch frontend/postcss.config.js

# Create styles
mkdir -p frontend/styles
touch frontend/styles/globals.css

# Create _app.tsx
touch frontend/pages/_app.tsx

# Create env example
touch frontend/.env.local.example
touch frontend/README.md
```

Then copy the content from each section above into the corresponding file.

---

## Installation

After creating all files:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

The frontend will be available at http://localhost:3000

---

## Next Steps

1. ✅ Create all frontend files (above)
2. Update docker-compose.yml to include frontend service
3. Enhance TECHNICAL_INTERVIEW.md with frontend Q&A
4. Create video walkthrough script
5. Create slide deck
6. Test end-to-end flow

See the main README for complete setup instructions.
