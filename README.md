# Let Me AI That For You

A sarcastic link-sharing tool inspired by [Let Me Google That For You](https://letmegooglethat.com/). Generate animated links that show someone how to use ChatGPT or Claude — because apparently asking an AI yourself is too much effort.

## How It Works

1. Visit the site and choose **ChatGPT** or **Claude**
2. Type your question and click the send button
3. Copy the generated link and share it with someone
4. When they open it, they'll see an animated demonstration of typing the question and hitting send — ending with "Was that so hard?" before being redirected to the actual AI chat

## Supported AI Providers

- **ChatGPT** — redirects to `chatgpt.com` with the query pre-filled
- **Claude** — redirects to `claude.ai` with the query pre-filled

## Development

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build      # Build for production (outputs to dist/)
npm run deploy     # Build and deploy to GitHub Pages
```

## Tech Stack

- Vite + React + TypeScript
- React Router for client-side routing
- Deployed via GitHub Pages

## License

MIT
