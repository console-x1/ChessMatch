// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}

// Chat functionality
const messageEvaluations = [
    { type: 'brilliant', text: 'Brillant', icon: 'fa-star' },
    { type: 'best', text: 'Meilleur coup', icon: 'fa-check-circle' },
    { type: 'good', text: 'Bon coup', icon: 'fa-thumbs-up' },
    { type: 'inaccuracy', text: 'Imprécision', icon: 'fa-exclamation' },
    { type: 'mistake', text: 'Erreur', icon: 'fa-times-circle' },
    { type: 'blunder', text: 'Gaffe', icon: 'fa-skull-crossbones' }
];

const aiResponses = [
    "Intéressant ! Raconte-moi en plus...",
    "J'aime ta façon de penser 😊",
    "Ça me donne envie de te connaître davantage",
    "Tu as l'air passionnant comme personne",
    "Hmm, je suis curieuse de voir où ça nous mène",
    "Tu m'intrigues vraiment",
    "C'est une perspective intéressante !",
    "J'adore discuter avec toi"
];

function sendMessage() {
    const input = document.getElementById('messageInput');
    const messageText = input.value.trim();
    
    if (messageText === '') return;
    
    const chatMessages = document.getElementById('chatMessages');
    
    // Random evaluation for user message
    const randomEval = messageEvaluations[Math.floor(Math.random() * messageEvaluations.length)];
    
    // Create user message
    const userMessage = document.createElement('div');
    userMessage.className = 'flex items-start space-x-3 justify-end message-animate';
    userMessage.innerHTML = `
        <div class="flex-1 flex flex-col items-end">
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl rounded-tr-none p-4 max-w-md">
                <p>${escapeHtml(messageText)}</p>
            </div>
            <div class="mt-2 mr-2">
                <span class="badge-${randomEval.type} inline-block px-3 py-1 rounded-lg text-xs font-semibold">
                    <i class="fas ${randomEval.icon} mr-1"></i>${randomEval.text}
                </span>
            </div>
        </div>
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-red-500 flex items-center justify-center flex-shrink-0">
            <i class="fas fa-user"></i>
        </div>
    `;
    
    chatMessages.appendChild(userMessage);
    input.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // AI response after delay
    setTimeout(() => {
        const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        const aiEval = messageEvaluations[Math.floor(Math.random() * 3)]; // Favor good evaluations for AI
        
        const aiMessage = document.createElement('div');
        aiMessage.className = 'flex items-start space-x-3 message-animate';
        aiMessage.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-robot"></i>
            </div>
            <div class="flex-1">
                <div class="bg-gray-700/50 rounded-2xl rounded-tl-none p-4 max-w-md">
                    <p>${aiResponse}</p>
                </div>
                <div class="mt-2 ml-2">
                    <span class="badge-${aiEval.type} inline-block px-3 py-1 rounded-lg text-xs font-semibold">
                        <i class="fas ${aiEval.icon} mr-1"></i>${aiEval.text}
                    </span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(aiMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Enter key to send message
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
