const chatInput = document.getElementById("text-area");
const sendChatBtn = document.getElementById("send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessage;

const API_KEY = "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";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p")

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-type" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{ role: "user", content: userMessage }]
        })
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((err)=> {
        messageElement.textContent = "Oops! Something went wrong! Please try again...";
    }).finally(()=> {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    });
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(()=> {
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600)
}

chatBotCloseBtn.addEventListener("tap", document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", ()=> document.body.classList.toggle("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);
