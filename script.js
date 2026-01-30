/* = CONFIGURATION = */
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1465838008958980128/BYgFcckr5DD_TnGw3nSRC-C5P0h9qfulOZ5lX_msCKTrLvbckof1lFq51lQNNNSZyse7"; 
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuQDx7FGROb-UsolVpdw4obYaTFk-Y6UP87Z9sfNfDVyWMAVgegpzB8sMk2GqQwQ3g/exec"; 

/* = SYNCHRONISATION MULTI-APPAREILS = */
// Si tu ouvres ton site avec ?user=TonNom, ça synchronise l'appareil
const urlParams = new URLSearchParams(window.location.search);
const userFromUrl = urlParams.get('user');
if (userFromUrl) {
    localStorage.setItem('userName', userFromUrl);
    localStorage.setItem('userProfile', 'Synchronisé');
}

/* = ICONES SVG = */
const ICONS = {
    defaut: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    Ecole: `<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
    Entreprise: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    Curieux: `<svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`
};

/* = GESTION DU PROFIL (MODAL) = */
const modal = document.getElementById('user-modal');
const userNameInput = document.getElementById('user-name-input');
const saveBtn = document.getElementById('save-profile-btn');
const profileCards = document.querySelectorAll('.profile-card');
const profileTrigger = document.getElementById('profile-trigger');
const closeModalX = document.getElementById('close-modal-x');

let selectedType = null;

// Ouvrir/Fermer
if(profileTrigger) profileTrigger.addEventListener('click', () => modal.style.display = 'flex');
if(closeModalX) closeModalX.addEventListener('click', () => modal.style.display = 'none');

// Sélection de carte
profileCards.forEach(card => {
    card.addEventListener('click', () => {
        profileCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedType = card.dataset.type;
    });
});

// Sauvegarder
if(saveBtn) {
    saveBtn.addEventListener('click', () => {
        const name = userNameInput.value.trim();
        if(!name || !selectedType) {
            alert("Merci de saisir un nom et de choisir un profil.");
            return;
        }
        localStorage.setItem('userName', name);
        localStorage.setItem('userProfile', selectedType);
        modal.style.display = 'none';
        updateProfileUI();
        // Envoyer une notification immédiate après identification
        sendDiscordVisitUpdate(true); 
    });
}

function updateProfileUI() {
    const name = localStorage.getItem('userName');
    const type = localStorage.getItem('userProfile');
    const statusText = document.getElementById('profile-status-text');
    const iconContainer = document.querySelector('.profile-trigger-icon');

    if(name && type && statusText) {
        statusText.innerText = name;
        if(iconContainer) iconContainer.innerHTML = ICONS[type] || ICONS.defaut;
    }
}

/* = SYSTÈME DE NOTIFICATIONS DISCORD INTELLIGENT = */
function sendDiscordVisitUpdate(force = false) {
    // 1. NE PAS ENVOYER SI L'ONGLET N'EST PAS VISIBLE (Correctif iPhone Chrome)
    if (document.visibilityState !== 'visible') return;

    // 2. NE PAS ENVOYER SI DÉJÀ FAIT DANS CETTE SESSION (Sauf si on vient de s'enregistrer)
    const sessionKey = 'notified_' + window.location.pathname;
    if (sessionStorage.getItem(sessionKey) && !force) return;

    const pageTitle = document.title;
    const pageUrl = window.location.href;
    const userProfile = localStorage.getItem('userProfile') || 'Non défini';
    const userName = localStorage.getItem('userName') || 'Anonyme';

    const data = {
        embeds: [{
            title: "👀 Nouvelle page consultée",
            description: force ? "L'utilisateur vient de mettre à jour son profil !" : "Visite de page standard",
            color: 0x3498db, 
            fields: [
                { name: "Page", value: pageTitle, inline: true },
                { name: "Utilisateur", value: userName + " (" + userProfile + ")", inline: true },
                { name: "Lien", value: pageUrl }
            ],
            timestamp: new Date()
        }]
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => {
        sessionStorage.setItem(sessionKey, 'true');
    })
    .catch(err => console.error("Erreur Discord:", err));
}

/* = INITIALISATION ET ÉVÉNEMENTS = */
window.addEventListener('load', () => {
    updateProfileUI();
    
    // Vérifier si c'est la première fois pour ouvrir le modal
    if(!localStorage.getItem('userName')) {
        setTimeout(() => {
            if(modal) modal.style.display = 'flex';
        }, 2000);
    }

    // Lancer la logique de notification
    sendDiscordVisitUpdate();
});

// Écouter quand l'utilisateur revient sur l'onglet (iPhone)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        sendDiscordVisitUpdate();
    }
});

// Notifier quand on clique sur un projet
document.addEventListener('click', (e) => {
    const projectCard = e.target.closest('.project-card');
    if (projectCard) {
        const projectName = projectCard.querySelector('h3').innerText;
        const userName = localStorage.getItem('userName') || 'Anonyme';
        
        fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `🚀 **${userName}** consulte le projet : **${projectName}**`
            })
        });
    }
});