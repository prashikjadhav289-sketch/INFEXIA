// ==========================================
// INFEXIA - VOICE & ROBOT CONTROLLER
// ==========================================

const robot = document.getElementById("robot");
const micButton = document.getElementById("micButton");
const statusText = document.getElementById("statusText");
const audioWave = document.getElementById("audioWave");
const webcam = document.getElementById("webcam");
const conversation = document.getElementById("conversation");


// ==========================================
// CAMERA
// ==========================================

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        webcam.srcObject = stream;

    } catch (error) {
        console.log("Camera permission not available.");
        statusText.textContent = "Camera unavailable";
    }
}


// ==========================================
// ROBOT SPEAK
// ==========================================

function speak(text) {

    if (!("speechSynthesis" in window)) {
        statusText.textContent = "Speech not supported";
        return;
    }

    speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(text);

    voice.lang = "en-IN";
    voice.rate = 0.95;
    voice.pitch = 1.05;
    voice.volume = 1;

    voice.onstart = function () {

        statusText.textContent = "INFEXIA is speaking...";

        robot.classList.add("speaking");

        audioWave.classList.add("active");

    };


    voice.onend = function () {

        statusText.textContent = "Listening...";

        robot.classList.remove("speaking");

        audioWave.classList.remove("active");

        startListening();

    };


    speechSynthesis.speak(voice);
}


// ==========================================
// ADD MESSAGE
// ==========================================

function addMessage(type, text) {

    const message = document.createElement("div");

    if (type === "user") {

        message.className = "user-message";

        message.innerHTML =
            "<strong>You:</strong> " + text;

    } else {

        message.className = "ai-message";

        message.innerHTML =
            "<strong>INFEXIA:</strong> " + text;
    }

    conversation.appendChild(message);

    conversation.scrollTop = conversation.scrollHeight;
}


// ==========================================
// LOCAL AI RESPONSE
// ==========================================

function getResponse(question) {

    const q = question.toLowerCase();


    if (
        q.includes("hello") ||
        q.includes("hi") ||
        q.includes("hey")
    ) {
        return "Hello Sir. I am INFEXIA, your Smart Country AI Assistant.";
    }


    if (
        q.includes("your name") ||
        q.includes("who are you")
    ) {
        return "My name is INFEXIA. I am an AI assistant designed for the Smart Country project.";
    }


    if (
        q.includes("smart country")
    ) {
        return "Smart Country is a futuristic concept that uses technology, artificial intelligence and smart systems to improve people's lives.";
    }


    if (
        q.includes("smart city")
    ) {
        return "A Smart City uses technology for better transportation, safety, energy management, waste management and public services.";
    }


    if (
        q.includes("smart farming") ||
        q.includes("farming")
    ) {
        return "Smart Farming uses sensors, automation and artificial intelligence to improve agricultural productivity and save resources.";
    }


    if (
        q.includes("how are you")
    ) {
        return "I am functioning perfectly and ready to assist you, Sir.";
    }


    if (
        q.includes("thank")
    ) {
        return "You're welcome, Sir.";
    }


    if (
        q.includes("bye")
    ) {
        return "Goodbye, Sir. Have a great day.";
    }


    return "I am currently running in API-free demonstration mode. My full AI brain can be connected later through a secure backend.";
}


// ==========================================
// SPEECH RECOGNITION
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition = null;

let listening = false;


if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = false;


    recognition.onstart = function () {

        listening = true;

        statusText.textContent = "Listening...";

        micButton.textContent = "🎙️ Listening...";

    };


    recognition.onresult = function (event) {

        const text =
            event.results[0][0].transcript;

        addMessage("user", text);


        const answer =
            getResponse(text);

        addMessage("ai", answer);


        speak(answer);

    };


    recognition.onerror = function (event) {

        console.log("Speech error:", event.error);

        listening = false;

        micButton.textContent = "🎤 Tap & Speak";

        statusText.textContent = "Ready";
    };


    recognition.onend = function () {

        listening = false;

        micButton.textContent = "🎤 Tap & Speak";
    };

}


// ==========================================
// START LISTENING
// ==========================================

function startListening() {

    if (!recognition) {

        statusText.textContent =
            "Speech recognition not supported.";

        return;
    }


    if (listening) {
        return;
    }


    try {

        recognition.start();

    } catch (error) {

        console.log(error);

    }
}


// ==========================================
// MICROPHONE BUTTON
// ==========================================

micButton.addEventListener("click", function () {

    startListening();

});


// ==========================================
// START SYSTEM
// ==========================================

window.addEventListener("load", function () {

    startCamera();


    setTimeout(function () {

        const greeting =
            "Hello Sir. I am INFEXIA, your Smart Country AI Assistant. System online and ready.";

        addMessage("ai", greeting);

        speak(greeting);

    }, 1200);

});
