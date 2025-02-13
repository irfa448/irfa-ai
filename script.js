const API_KEY = "AIzaSyDVh6IN6qAz8QQd7SPTYxaMSQSplSMMkiE"; // Ganti dengan API Key Gemini
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText";

async function sendMessage() {
    let inputField = document.getElementById("userInput");
    let chatbox = document.getElementById("chatbox");
    let userMessage = inputField.value.trim().toLowerCase();

    if (userMessage === "") return;

    // Tambahin chat user ke chatbox
    chatbox.innerHTML += `<div class="message user">${userMessage}</div>`;
    inputField.value = "";

    // Cek kalau perintah admin buat ubah tampilan
    if (userMessage.startsWith("guaadmin, ubah tampilannya menjadi")) {
        let styleType = userMessage.replace("guaadmin, ubah tampilannya menjadi", "").trim();
        updateFullUIWithAI(styleType);
        return;
    }

    // Panggil Gemini API buat respon normal
    try {
        let response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: { text: userMessage } })
        });

        let data = await response.json();
        let reply = data.candidates?.[0]?.output || "Maaf, gua nggak ngerti.";

        // Tambahin chat AI ke chatbox
        chatbox.innerHTML += `<div class="message bot">${reply}</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;
    } catch (error) {
        chatbox.innerHTML += `<div class="message bot">Error: ${error.message}</div>`;
    }
}

// AI akan generate HTML + CSS + JS buat update tampilan
async function updateFullUIWithAI(styleType) {
    let chatbox = document.getElementById("chatbox");

    try {
        let promptText = `Buat ulang tampilan website chatbot dalam HTML, CSS, dan JavaScript dengan gaya ${styleType}. Hasilkan semua kode dalam satu file HTML lengkap.`;

        let response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: { text: promptText } })
        });

        let data = await response.json();
        let newCode = data.candidates?.[0]?.output || "";

        if (!newCode.includes("<html>") || !newCode.includes("</html>")) {
            chatbox.innerHTML += `<div class="message bot">Gagal update tampilan.</div>`;
            return;
        }

        // Overwrite halaman dengan kode baru dari AI
        document.open();
        document.write(newCode);
        document.close();

    } catch (error) {
        chatbox.innerHTML += `<div class="message bot">Error: ${error.message}</div>`;
    }
          }
