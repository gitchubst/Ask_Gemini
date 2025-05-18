# Ask Gemini
A simple extension where you can right-click to ask Gemini questions about highlighted text or general queries.
<br>
<br>
<br>

## Downloading
Go to the green box on the right that says "Code". Once you click on it, look at the bottom of the popup and click "Download ZIP"
Once you download the zip file, make sure to unpack, or open, it.
<br>
<br>
<br>

## API Key
In a text editor, open up your files
Go to background.js and replace the PUT_YOUR_KEY with your API key. You can find it here: [Gemini API Key](https://aistudio.google.com/app/apikey).
<br>
<br>
<br>

## Loading the Extension
Go back to google chrome now and on the right side of the page, right next to your profile (on the same line as the search bar), click the three dots. Now, look down until you hover over "Extensions" and click "Manage Extensions". Turn on developer mode on the right corner if its not already on. Now, you should see 3 buttons appear, one of which is "Load unpacked". Click on that and select the folder (Ask_Gemini-main) that has the files for Ask Gemini. Once you've clicked that, it should say "extension loaded", where all you need to do now is reload any page and the extension should work.
<br>
<br>
<br>

## How to Use Ask Gemini
Right click anything and a default dropdown shoudl appear, bellow, in your extensions on that dropdown should be something called Ask Gemini. Click on that and it should open a popup. You will be shown your highlighted text in the popup. For "Your Question/Input", just put anything you want there and press enter. The input you type will be added on to the higlighted section and Gemini will answer bellow. If you're too lazy to type, just click "Summarize", "Explain", or "Answer", and that will replace whtever is in the "Your Question/Input" space. On the bottom right of the popup, you can resize it to make it larger or smaller.
<br>
<br>
<br>

## Changing the model (Optional)
Skip this step if you don't want to change the model. Open background.js, where you can change the model type. Here's how. Go to where where it says _const VERSION = "gemini-2.0-flash";_. The variable VERSION is at the start of background.js, right bellow the API key. Replace the text in the double quotes with a model of your choice. You can find more here: [Gemini Models](https://ai.google.dev/gemini-api/docs/models). Make sure that you enter the second, black part of the model variant with the dashes. Only copy and paste that part into the URL. Make sure you follow the same formatting as in the code.
