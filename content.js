let geminiPopup = null;
let lastMouseX = 0;
let lastMouseY = 0;
let currentSelectedText = "";
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

function createGeminiPopup(selectedText) {
  removeGeminiPopup();
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
        <textarea id="gemini-question-input" rows="3" placeholder="Type something and press enter"></textarea>
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
  const presetButtonsContainer = geminiPopup.querySelector('#gemini-preset-buttons');
  const presetButtons = geminiPopup.querySelectorAll('#gemini-preset-buttons button');
  const responseArea = geminiPopup.querySelector('#gemini-response-content');
  const loadingIndicator = geminiPopup.querySelector('#gemini-loading');

  closeButton.addEventListener('click', removeGeminiPopup);

  if (presetButtonsContainer) {
    presetButtonsContainer.style.justifyContent = 'center';
  }

  presetButtons.forEach(button => {
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.paddingLeft = '16px';
    button.style.paddingRight = '16px';
    button.style.minWidth = '90px';
    button.addEventListener('click', () => {
      const prompt = button.getAttribute('data-prompt');
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
        responseArea.textContent = '';
        loadingIndicator.style.display = 'block';
        callGemini(prompt, currentSelectedText);
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
    if (e.target === closeButton || e.target.parentElement === closeButton || e.button !== 0) return;
    
    isDragging = true;
    const rect = geminiPopup.getBoundingClientRect();

    geminiPopup.style.position = 'fixed';
    geminiPopup.style.left = `${rect.left}px`;
    geminiPopup.style.top = `${rect.top}px`;
    geminiPopup.style.margin = '0'; 

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    geminiPopup.style.cursor = 'grabbing';
    if (header) header.style.cursor = 'grabbing';
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    e.preventDefault();
  });
}

function handleMouseMove(e) {
  if (!isDragging || !geminiPopup) return;
  
  let newX = e.clientX - offsetX;
  let newY = e.clientY - offsetY;

  const popupRect = geminiPopup.getBoundingClientRect(); 
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (newX < 0) newX = 0;
  if (newX + popupRect.width > viewportWidth) newX = viewportWidth - popupRect.width;
  if (newY < 0) newY = 0;
  if (newY + popupRect.height > viewportHeight) newY = viewportHeight - popupRect.height;

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
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
}

function removeGeminiPopup() {
  if (geminiPopup) {
    if (isDragging) {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        isDragging = false;
    }
    geminiPopup.remove();
    geminiPopup = null;
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
  }
  if (top < scrollY + buffer) top = scrollY + buffer;

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
  const safeContextText = contextText || "";
  chrome.runtime.sendMessage({
      type: "CALL_GEMINI_API",
      prompt: prompt,
      contextText: safeContextText
    },
    (response) => {
      if (!geminiPopup) {
          return;
      }
      const loadingIndicator = geminiPopup.querySelector('#gemini-loading');
      const responseArea = geminiPopup.querySelector('#gemini-response-content');

      if (loadingIndicator) loadingIndicator.style.display = 'none';

      if (!responseArea) {
          return;
      }

      if (chrome.runtime.lastError) {
        responseArea.textContent = `Error: ${chrome.runtime.lastError.message}`;
        responseArea.classList.add('gemini-error');
      } else if (response && response.success) {
        let responseText = response.response;
        if (typeof responseText === 'string') {
          responseText = responseText.replace(/\*\*/g, '');
        } else {
          responseText = ""; 
        }
        responseArea.innerHTML = escapeHtml(responseText).replace(/\n/g, '<br>');
        responseArea.classList.remove('gemini-error');
      } else {
        const errorMessage = response ? response.error : "An unknown communication error occurred";
        responseArea.textContent = `Error: ${escapeHtml(errorMessage)}`;
        responseArea.classList.add('gemini-error');
      }
    }
  );
}

document.addEventListener('contextmenu', (event) => {
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "ASK_GEMINI_CONTEXT_MENU") {
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
