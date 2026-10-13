
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const history = document.getElementById("history");
const sidebar = document.getElementById("sidebar");
const toast = document.getElementById("toast");

let chats = [];
let currentChat = null;
let toastTimer;

// Show a small notification
function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2200);
}

// Create a new conversation
function newChat() {
  currentChat = {
    title: "New chat",
    messages: []
  };

  chats.unshift(currentChat);
  renderHistory();
  renderMessages();

  messageInput.value = "";
  messageInput.style.height = "auto";
  messageInput.focus();
  sidebar.classList.remove("open");
}

// Display chat history in the sidebar
function renderHistory() {
  history.replaceChildren();

  chats.forEach((chat) => {
    const button = document.createElement("button");

    button.className = "history-item";
    button.textContent = chat.title;

    if (chat === currentChat) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentChat = chat;
      renderHistory();
      renderMessages();
      sidebar.classList.remove("open");
    });

    history.appendChild(button);
  });
}

// Display messages in the selected chat
function renderMessages() {
  messages.replaceChildren();

  const hasMessages =
    currentChat && currentChat.messages.length > 0;

  welcome.style.display = hasMessages ? "none" : "flex";

  if (!currentChat) return;

  currentChat.messages.forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "message " + item.role;

    const label = document.createElement("div");
    label.className = "message-label";
    label.textContent =
      item.role === "user" ? "You" : "ChatGPT demo";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = item.text;

    wrapper.append(label, bubble);
    messages.appendChild(wrapper);
  });

  messages.scrollTop = messages.scrollHeight;
}

// Add a message to the current chat
function addMessage(role, text) {
  currentChat.messages.push({ role, text });
  renderMessages();
}

// Simple demo replies (not real AI)
function getDemoReply(text) {
  const message = text.toLowerCase();

  if (message.includes("html")) {
    return "HTML creates the structure of a webpage. " +
      "For example, headings use <h1> and paragraphs use <p>. " +
      "CSS styles the page, and JavaScript adds interactivity.";
  }

  if (message.includes("css")) {
    return "CSS is used to style webpages. " +
      "You can change colors, fonts, spacing, layouts, " +
      "and make your website responsive.";
  }

  if (message.includes("javascript") || message.includes(" js")) {
    return "JavaScript makes webpages interactive. " +
      "It can respond to button clicks, validate forms, " +
      "update content, and handle user input.";
  }

  if (message.includes("project")) {
    return "Here are three beginner-friendly projects:\n" +
      "1. Personal portfolio website\n" +
      "2. To-do list app\n" +
      "3. Student productivity dashboard\n\n" +
      "Build the structure with HTML, style it with CSS, " +
      "and add functionality using JavaScript.";
  }

  if (message.includes("hello") || message.includes("hi")) {
    return "Hello! Welcome to this ChatGPT-inspired demo. " +
      "What would you like to learn today?";
  }

  return "Thanks for your message! This is a frontend demo, " +
    "so I cannot generate a real AI answer yet. " +
    "You can connect a backend and an AI API to enable " +
    "real responses.";
}

// Send a message
function sendMessage(text) {
  const cleanText = text.trim();

  if (!cleanText) return;

  if (!currentChat) {
    currentChat = {
      title: "New chat",
      messages: []
    };

    chats.unshift(currentChat);
  }

  if (currentChat.messages.length === 0) {
    currentChat.title =
      cleanText.length > 28
        ? cleanText.slice(0, 28) + "..."
        : cleanText;
  }

  addMessage("user", cleanText);

  messageInput.value = "";
  messageInput.style.height = "auto";

  renderHistory();

  // Display a demo response after a short delay
  const reply = getDemoReply(cleanText);

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.textContent = "Thinking...";
  messages.appendChild(typing);

  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => {
    typing.remove();
    addMessage("assistant", reply);
  }, 600);
}

// Form submission
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

// Enter to send; Shift + Enter for a new line
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

// Automatically grow the input box
messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";

  messageInput.style.height =
    Math.min(messageInput.scrollHeight, 180) + "px";
});

// New chat button
document.getElementById("newChat").addEventListener(
  "click",
  newChat
);

// Welcome screen suggestion buttons
document.querySelectorAll(".suggestion").forEach((button) => {
  button.addEventListener("click", () => {
    sendMessage(button.dataset.prompt);
  });
});

// Open and close the sidebar
document.getElementById("menuButton").addEventListener(
  "click",
  () => sidebar.classList.toggle("open")
);

document.getElementById("closeSidebar").addEventListener(
  "click",
  () => sidebar.classList.remove("open")
);

// Demo controls
document.getElementById("shareButton").addEventListener(
  "click",
  () => showToast("Demo: sharing is not connected yet.")
);

document.getElementById("searchButton").addEventListener(
  "click",
  () => showToast("Use the chat list to open a conversation.")
);

document.getElementById("exploreButton").addEventListener(
  "click",
  () => showToast("Explore is a demo feature.")
);

document.getElementById("modelButton").addEventListener(
  "click",
  () => showToast("This is a frontend demo model.")
);

document.getElementById("attachButton").addEventListener(
  "click",
  () => showToast("File uploads are not enabled in this demo.")
);

document.getElementById("toolsButton").addEventListener(
  "click",
  () => showToast("Additional tools are not connected yet.")
);

// Start with a blank welcome screen
newChat();
