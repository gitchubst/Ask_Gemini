console.log("Gemini content script loaded");

let geminiPopup = null;
let lastMouseX = 0;
let lastMouseY = 0;
let currentSelectedText = "";

let isDragging = false;
let offsetX = 0;
let offsetY = 0;


function createGeminiPopup(selectedText) {
  removeGeminiPopup();

  console.log("Creating Gemini popup.");
  currentSelectedText = selectedText || "";

  geminiPopup = document.createElement('div');
  geminiPopup.id = 'gemini-popup-container';
  geminiPopup.style.position = 'absolute';
  geminiPopup.style.zIndex = '2147483647';
  geminiPopup.style.visibility = 'hidden';

  geminiPopup.innerHTML = `
    <div id="gemini-popup-header">
      <span>Ask Gemini</span>
      <button id="gemini-popup-close" title="Close">X</button>
    </div>
    <div id="gemini-popup-content">
      ${currentSelectedText ? `<div id="gemini-selected-text-display"><b>Highlighted:</b><p>${escapeHtml(currentSelectedText.substring(0, 200))}${currentSelectedText.length > 200 ? '...' : ''}</p></div>` : ''}
      <div id="gemini-input-area">
        <label for="gemini-question-input">Your Question/Input:</label>
        <textarea id="gemini-question-input" rows="3" placeholder="Type a question and press enter"></textarea>
        <div id="gemini-preset-buttons">
          <button data-prompt="Summarize">Summarize</button>
          <button data-prompt="Explain">Explain</button>
          <button data-prompt="Answer">Answer</button>
         </div>
      </div>
      <div id="gemini-response-area">
        <div id="gemini-loading" style="display: none;">Thinking</div>
        <div id="gemini-response-content"></div>
      </div>
    </div>
  `;

  document.body.appendChild(geminiPopup);
  positionPopup(lastMouseX, lastMouseY);

  const header = geminiPopup.querySelector('#gemini-popup-header');
  const closeButton = geminiPopup.querySelector('#gemini-popup-close');
  const inputField = geminiPopup.querySelector('#gemini-question-input');
  const presetButtons = geminiPopup.querySelectorAll('#gemini-preset-buttons button');
  const responseArea = geminiPopup.querySelector('#gemini-response-content');
  const loadingIndicator = geminiPopup.querySelector('#gemini-loading');

  closeButton.addEventListener('click', removeGeminiPopup);

  presetButtons.forEach(button => {
    button.addEventListener('click', () => {
      const prompt = button.getAttribute('data-prompt');
      console.log(`Preset button clicked: ${prompt}`);
      inputField.value = '';
      responseArea.textContent = '';
      loadingIndicator.style.display = 'block';
      inputField.style.cursor = 'default';
      callGemini(prompt, currentSelectedText);
    });
  });

  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      const prompt = inputField.value.trim();
      if (prompt) {
        console.log(`Custom question submitted via Enter: ${prompt}`);
        responseArea.textContent = '';
        loadingIndicator.style.display = 'block';
        callGemini(prompt, currentSelectedText);
      } else {
         console.log("Enter pressed with empty input");
      }
    }
  });

  inputField.addEventListener('mouseenter', () => {
    if (inputField.value.length > 0) {
      inputField.style.cursor = 'text';
    }
  });

  inputField.addEventListener('mouseleave', () => {
    inputField.style.cursor = 'default';
  });

  inputField.addEventListener('input', () => {
    if (inputField.value.length > 0) {
      inputField.style.cursor = 'text';
    } else {
      inputField.style.cursor = 'default';
    }
  });


  header.addEventListener('mousedown', (e) => {
    if (e.target === closeButton) return;

    isDragging = true;
    offsetX = e.clientX - geminiPopup.getBoundingClientRect().left;
    offsetY = e.clientY - geminiPopup.getBoundingClientRect().top;
    geminiPopup.style.cursor = 'grabbing';
    header.style.cursor = 'grabbing';
    console.log("Dragging started");

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });

  setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
  }, 0);
}

function handleMouseMove(e) {
  if (!isDragging || !geminiPopup) return;

  let newX = e.clientX - offsetX;
  let newY = e.clientY - offsetY;

  geminiPopup.style.left = `${newX}px`;
  geminiPopup.style.top = `${newY}px`;
}

function handleMouseUp() {
  if (!isDragging) return;
  isDragging = false;
  if (geminiPopup) {
      const header = geminiPopup.querySelector('#gemini-popup-header');
      geminiPopup.style.cursor = 'default';
      if (header) {
        header.style.cursor = 'grab';
      }
  }
  console.log("Dragging stopped");

  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}


function removeGeminiPopup() {
  if (geminiPopup) {
    console.log("Removing Gemini popup.");
    if (isDragging) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        isDragging = false;
    }
    geminiPopup.remove();
    geminiPopup = null;
    document.removeEventListener('click', handleClickOutside, true);
  }
}

function handleClickOutside(event) {
    if (geminiPopup && !geminiPopup.contains(event.target) && !isDragging) {
        console.log("Clicked outside popup. Closing.");
        removeGeminiPopup();
    }
}


function positionPopup(x, y) {
  if (!geminiPopup) return;

  geminiPopup.style.visibility = 'hidden';
  geminiPopup.style.display = 'flex';
  const popupRect = geminiPopup.getBoundingClientRect();
  geminiPopup.style.display = '';

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const buffer = 10;

  let top = y + scrollY - popupRect.height - buffer;
  if (top < scrollY + buffer) {
      top = y + scrollY + buffer;
  }
  if (top + popupRect.height > scrollY + viewportHeight - buffer) {
      top = scrollY + viewportHeight - popupRect.height - buffer;
      if (top < scrollY) top = scrollY + buffer;
  }

  let left = x + scrollX + buffer;
  if (left + popupRect.width > scrollX + viewportWidth - buffer) {
    left = x + scrollX - popupRect.width - buffer;
  }
   if (left < scrollX + buffer) left = scrollX + buffer;


  geminiPopup.style.left = `${left}px`;
  geminiPopup.style.top = `${top}px`;
  geminiPopup.style.visibility = 'visible';
}


function callGemini(prompt, contextText) {
  console.log("Sending request to background script");
  const safeContextText = contextText || "";

  chrome.runtime.sendMessage({
      type: "CALL_GEMINI_API",
      prompt: prompt,
      contextText: safeContextText
    },
    (response) => {
      if (!geminiPopup) {
          console.log("Popup closed before response received");
          return;
      }
      const loadingIndicator = geminiPopup.querySelector('#gemini-loading');
      const responseArea = geminiPopup.querySelector('#gemini-response-content');

      if (loadingIndicator) loadingIndicator.style.display = 'none';

      if (!responseArea) {
          console.error("Response area not found in the popup");
          return;
      }

      if (chrome.runtime.lastError) {
        console.error("Messaging error:", chrome.runtime.lastError.message);
        responseArea.textContent = `Error: ${chrome.runtime.lastError.message}`;
        responseArea.classList.add('gemini-error');
      } else if (response && response.success) {
        console.log("Received success response from background:", response.response);
        responseArea.innerHTML = escapeHtml(response.response).replace(/\n/g, '<br>');
        responseArea.classList.remove('gemini-error');
      } else {
        const errorMessage = response ? response.error : "An unknown communication error occurred";
        console.error("Received error response from background:", errorMessage);
        responseArea.textContent = `Error: ${escapeHtml(errorMessage)}`;
        responseArea.classList.add('gemini-error');
      }
    }
  );
}


document.addEventListener('contextmenu', (event) => {
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
  console.log(`Context menu opened at viewport coordinates (${lastMouseX}, ${lastMouseY})`);
}, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ASK_GEMINI_CONTEXT_MENU") {
    console.log("Received message from background script to show popup");
    createGeminiPopup(request.selectedText);
  }
});

function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        return '';
    }
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

console.log("Gemini content script event listeners attached");