# Ask Gemini
This is a simple extension where you can right-click to ask Gemini questions about highlighted text or general queries <br><br><br>

## API Key
Go to background.js and replace the PUT_YOUR_KEY with your API key
<br>
You can find it here: [Gemini API Key](https://aistudio.google.com/app/apikey)
<br>
<br>
## Changing the model
Still on hackground.js, where you can change the model type. Here's how:
Go to this part of the code:
```
GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${GEMINI_API_KEY}`;
```
Notice where it says _gemini-2.5-flash-preview-04-17_. Replace that with a model of your choice. You can find more here: [Gemini Models](https://ai.google.dev/gemini-api/docs/models). Make sure that you enter the second, black part of the model variant with the dashes. Only copy and paste that part into the URL.
