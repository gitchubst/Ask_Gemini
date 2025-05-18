const GEMINI_API_KEY = "PUT_YOUR_KEY";
const VERSION = "gemini-2.0-flash";

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${VERSION}:generateContent?key=${GEMINI_API_KEY}`;

function setupContextMenu() {
  chrome.contextMenus.create({
    id: "ask-gemini",
    title: "Ask Gemini",
    contexts: ["all"]
  });
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Gemini Extension Installed. Setting up context menu");
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "ask-gemini" && tab.id) {
    console.log("Context menu clicked. Sending message to content script.");
    console.log("Selected text:", info.selectionText);

    chrome.tabs.sendMessage(tab.id, {
      type: "ASK_GEMINI_CONTEXT_MENU",
      selectedText: info.selectionText || ""
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "CALL_GEMINI_API") {
    console.log("Received request from content script to call Gemini API");
    console.log("Prompt:", request.prompt);
    console.log("Context Text:", request.contextText);

    let fullPrompt = request.prompt;
    if (request.contextText && request.contextText.trim() !== "") {
      fullPrompt += `\n\nContext:\n"""\n${request.contextText}\n"""`;
    }

    console.log("Full prompt being sent to Gemini:", fullPrompt);

    fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }]
      })
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
          console.error("Gemini API Error Response:", errorData);
          throw new Error(`API Error (${response.status}): ${errorData?.error?.message || 'Unknown error'}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Gemini API Success Response:", data);
      let textResponse = "Sorry, I couldn't get a response";
      if (data.candidates && data.candidates.length > 0 &&
          data.candidates[0].content && data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0) {
        textResponse = data.candidates[0].content.parts[0].text;
      } else if (data.promptFeedback && data.promptFeedback.blockReason) {
        textResponse = `Request blocked: ${data.promptFeedback.blockReason}`;
        if (data.promptFeedback.blockReasonMessage) {
             textResponse += ` - ${data.promptFeedback.blockReasonMessage}`;
        }
         console.warn("Gemini prompt blocked:", data.promptFeedback);
      }
      sendResponse({ success: true, response: textResponse });
    })
    .catch(error => {
      console.error("Error calling Gemini API:", error);
      sendResponse({ success: false, error: error.message || "An unknown error occurred." });
    });

    return true;
  }
});

console.log("Gemini background script loaded");
