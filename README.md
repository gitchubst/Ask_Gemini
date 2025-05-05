# Ask Gemini

This is a simple extension where you can right-click to ask Gemini questions about highlighted text or general queries

1. All you need to do is to go to background.js and replace the PUT_YOUR_KEY with an your API key that you can find here: https://aistudio.google.com/app/apikey.
2. Still on hackground.js, where you can change the model type. Here's how:
&nbsp &nbsp &nbsp &nbsp const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${GEMINI_API_KEY}`;
