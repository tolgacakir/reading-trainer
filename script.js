let sentences = [];
let currentSentenceIndex = 0;

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const inputText = document.getElementById('inputText');
const processTextButton = document.getElementById('processText');
const sentenceDisplay = document.getElementById('sentenceDisplay');
const prevSentenceButton = document.getElementById('prevSentence');
const nextSentenceButton = document.getElementById('nextSentence');
const translation = document.getElementById('translation');
const openModalButton = document.getElementById('openModal');
const themeToggleButton = document.getElementById('themeToggle');

openModalButton.onclick = function() {
    modal.style.display = 'flex';
};

closeModal.onclick = function() {
    modal.style.display = 'none';
};

processTextButton.addEventListener('click', () => {
    const text = inputText.value;
    sentences = text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s/);
    currentSentenceIndex = 0;
    displaySentence();
    modal.style.display = 'none';
    translation.value = '';
});

prevSentenceButton.addEventListener('click', () => {
    if (currentSentenceIndex > 0) {
        currentSentenceIndex--;
        displaySentence();
    }
});

nextSentenceButton.addEventListener('click', () => {
    if (currentSentenceIndex < sentences.length - 1) {
        currentSentenceIndex++;
        displaySentence();
    }
});

themeToggleButton.onclick = function() {
    document.body.classList.toggle('light-mode');
    // Optionally, store theme in localStorage
    if(document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
};

// On load, set theme from localStorage
window.onload = function() {
    const theme = localStorage.getItem('theme');
    if(theme === 'light') {
        document.body.classList.add('light-mode');
    }
    modal.style.display = 'flex';
};

function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (sentences.length > 0) {
        const percent = ((currentSentenceIndex + 1) / sentences.length) * 100;
        progressBar.style.width = percent + '%';
    } else {
        progressBar.style.width = '0%';
    }
}

function displaySentence() {
    if (sentences.length > 0) {
        sentenceDisplay.textContent = sentences[currentSentenceIndex];
        translation.value = '';
    } else {
        sentenceDisplay.textContent = 'No sentences to display.';
        translation.value = '';
    }
    updateProgressBar();
}

window.onload = function() {
    const theme = localStorage.getItem('theme');
    if(theme === 'light') {
        document.body.classList.add('light-mode');
    }
    inputText.value = "This is the first sentence. Here is the second one! Is this the third sentence? Yes, it is.";
    modal.style.display = 'flex';
};