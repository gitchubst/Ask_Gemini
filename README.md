# Ask Gemini

This is a simple extension where you can right-click to ask Gemini questions about highlighted text or general queries
<br>
<br>
## API Key
All you need to do is to go to background.js and replace the PUT_YOUR_KEY with an your API key
<br>
You can find here: https://aistudio.google.com/app/apikey
<br>
<br>
## Changing the model
Still on hackground.js, where you can change the model type. Here's how:
Go to this part of the code:
GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${GEMINI_API_KEY}`;
```
function test() {
  console.log("notice the blank line before this function?");
}
```


# Example headings

## Sample Section

## This'll be a _Helpful_ Section About the Greek Letter Θ!
A heading containing characters not allowed in fragments, UTF-8 characters, two consecutive spaces between the first and second words, and formatting.

## This heading is not unique in the file

TEXT 1

## This heading is not unique in the file

TEXT 2

# Links to the example headings above

Link to the sample section: [Link Text](#sample-section).

Link to the helpful section: [Link Text](#thisll-be-a-helpful-section-about-the-greek-letter-Θ).

Link to the first non-unique section: [Link Text](#this-heading-is-not-unique-in-the-file).

Link to the second non-unique section: [Link Text](#this-heading-is-not-unique-in-the-file-1).
