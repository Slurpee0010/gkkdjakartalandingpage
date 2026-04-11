<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f2713288-f0fc-4537-9851-200ba3ab7d05

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
3. Open:
   `http://localhost:3000`

## Notes

- The current app does not read `GEMINI_API_KEY` during local startup, so `.env.local` is optional for the existing codebase.
- Firebase client configuration is loaded from `firebase-applet-config.json`. Pages that read or write data still depend on that Firebase project being reachable.
