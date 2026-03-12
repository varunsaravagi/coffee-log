# Coffee Log

A mobile-friendly Next.js app for logging coffee bean bags, grinder details, and grind settings you want to reuse later.

## Features
- Add a new bean with brand, bean name, log date, roast date, flavor profile, bag size, price, and bag photo
- Save grinders separately and reuse them in grind-setting logs
- Search past beans and recall grinder settings
- Use the app from desktop or mobile browser

## Local Setup
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Common Commands
```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Notes
- Local SQLite data is stored under `data/`
- Uploaded images are stored under `data/uploads/`
- These paths are ignored by git and are meant for local development data
