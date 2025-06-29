let sentences = [];
let currentSentenceIndex = 0;
let translations = [];

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
const firstSentenceButton = document.getElementById('firstSentence');
const clearInputButton = document.getElementById('clearInput');
const undoInputButton = document.getElementById('undoInput');

let inputTextHistory = [];

// Load jsPDF from CDN if not already loaded
function loadJsPDF(callback) {
    if (window.jspdf) {
        callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = callback;
    document.body.appendChild(script);
}

openModalButton.onclick = function() {
    modal.style.display = 'flex';
    setTimeout(() => { inputText.focus(); }, 50);
};

closeModal.onclick = function() {
    modal.style.display = 'none';
};

processTextButton.addEventListener('click', () => {
    const text = inputText.value;
    sentences = text.split(/(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|\!)\s/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
    currentSentenceIndex = 0;
    translations = [];
    displaySentence();
    modal.style.display = 'none';
    translation.value = '';
    focusTranslation();
});

function focusTranslation() {
    translation.focus();
}

prevSentenceButton.addEventListener('click', () => {
    if (currentSentenceIndex > 0) {
        currentSentenceIndex--;
        displaySentence();
    }
    focusTranslation();
});

nextSentenceButton.addEventListener('click', () => {
    if (currentSentenceIndex < sentences.length - 1) {
        currentSentenceIndex++;
        displaySentence();
    }
    focusTranslation();
});

firstSentenceButton.addEventListener('click', () => {
    if (sentences.length > 0) {
        currentSentenceIndex = 0;
        displaySentence();
    }
    focusTranslation();
});

function updateThemeToggleIcon() {
    if (document.body.classList.contains('light-mode')) {
        themeToggleButton.textContent = '🌙'; // Light mode: show moon
    } else {
        themeToggleButton.textContent = '☀️'; // Dark mode: show sun
    }
}

themeToggleButton.onclick = function() {
    document.body.classList.toggle('light-mode');
    if(document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
    updateThemeToggleIcon();
    focusTranslation();
};

// On load, set theme from localStorage
window.onload = function() {
    const theme = localStorage.getItem('theme');
    if(theme === 'light') {
        document.body.classList.add('light-mode');
    }
    updateThemeToggleIcon();
    inputText.value = "This is the first sentence. Here is the second one! Is this the third sentence? Yes, it is.";
    modal.style.display = 'flex';
    setTimeout(() => { inputText.focus(); }, 50);
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
        translation.value = translations[currentSentenceIndex] || '';
    } else {
        sentenceDisplay.textContent = 'No sentences to display.';
        translation.value = '';
    }
    updateProgressBar();
}

translation.addEventListener('input', () => {
    translations[currentSentenceIndex] = translation.value;
});

inputText.addEventListener('input', () => {
    inputTextHistory.push(inputText.value);
});

clearInputButton.addEventListener('click', () => {
    inputText.value = '';
    inputTextHistory.push('');
    inputText.focus();
});

undoInputButton.addEventListener('click', () => {
    if (inputTextHistory.length > 1) {
        inputTextHistory.pop();
        inputText.value = inputTextHistory[inputTextHistory.length - 1];
    } else if (inputTextHistory.length === 1) {
        inputText.value = '';
        inputTextHistory = [];
    }
    inputText.focus();
});

const printPdfButton = document.getElementById('printPdf');
printPdfButton.addEventListener('click', () => {
    loadJsPDF(() => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 15;
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i] || '';
            const translationText = translations[i] || '';
            doc.setFont('helvetica', 'normal');
            doc.text(`${i + 1}:`, 10, y);
            y += 7;
            doc.setFont('helvetica', 'bold');
            doc.text(sentence, 14, y);
            y += 7;
            doc.setFont('helvetica', 'italic');
            doc.text(translationText, 14, y);
            y += 12;
            if (y > 270) {
                doc.addPage();
                y = 15;
            }
        }
        doc.save('reading-trainer.pdf');
    });
});