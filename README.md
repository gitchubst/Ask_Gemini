# Ask Gemini
This is a simple extension where you can right-click to ask Gemini questions about highlighted text or general queries <br><br><br>

## API Key
All you need to do is to go to background.js and replace the PUT_YOUR_KEY with an your API key
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
Notice where it says "gemini-2.5-flash-preview-04-17"  
Replace that with a model of your choice. Here are the options:  <br>
&nbsp; &nbsp; &nbsp; &nbsp; 1. &nbsp; gemini-2.5-flash-preview-04-17
2. 
You can find them here: Link to the helpful section: [Gemini Models](https://ai.google.dev/gemini-api/docs/models)  
Make sure that you enter the second, black part of the model variant
