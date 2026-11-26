# Prosaic

A local AI writing playground for your desktop. One app for chatting with LLMs, managing prompts, organizing projects, and keeping notes — with the convenience of a subscription service, but running entirely on your own machine.

![version](https://img.shields.io/badge/version-1.0.0-0e0e0e) ![platform](https://img.shields.io/badge/platform-Windows-0e0e0e)

## Features

- **Multi-provider chat** — connect OpenAI-compatible, Anthropic, AWS Bedrock, and Mantle endpoints
- **Model picker** — search, pin, and group models; per-model overrides for temperature, max tokens, and thinking effort
- **Thinking (CoT) blocks** — collapsible reasoning shown alongside answers
- **Streaming responses** with adjustable reveal speed
- **Projects** — per-project instructions and file attachments included in context
- **Boards** — freeform node boards for mapping ideas with connected blocks
- **Sticky notes** — color-coded, pinnable scratch notes that save to a dock
- **Nine themes** — from inkblot to blue-hour, all locally rendered
- **Local-first storage** — everything lives in a SQLite database on your disk; export/import backups anytime

## Running from source

Requires [Node.js](https://nodejs.org) 20+.

```bash
npm install
npm start
```

The app stores its database at `%APPDATA%\prosaic\prosaic.db` (Windows).

## Building the installer

```bash
npm install
npm run dist
```

Outputs a Windows NSIS installer to the configured output directory.

## The browser version

`app/prosaic.html` is fully self-contained and also runs as a plain HTML file in any modern browser — in the browser it uses IndexedDB instead of SQLite.

## Privacy

No telemetry, no accounts, no servers. API keys you add in Settings are stored only on your machine, and exported backups exclude credentials.

## License

MIT — see [LICENSE](LICENSE).
