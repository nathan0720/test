/* = CONFIGURATION = */
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1465838008958980128/BYgFcckr5DD_TnGw3nSRC-C5P0h9qfulOZ5lX_msCKTrLvbckof1lFq51lQNNNSZyse7"; 
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuQDx7FGROb-UsolVpdw4obYaTFk-Y6UP87Z9sfNfDVyWMAVgegpzB8sMk2GqQwQ3g/exec"; 

/* = ICONES SVG = */
const ICONS = {
    defaut: `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    Ecole: `<svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
    Entreprise: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`,
    Curieux: `<svg viewBox="0 0 24 24"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>` // Main (Hand Wave)
};

/* = LOGIQUE PRINCIPALE = */
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. GESTION DU PROFIL & ANALYTICS --- */
    const profileTrigger = document.getElementById('profileTrigger');
    const modal = document.getElementById('profile-modal');
    const closeXBtn = document.getElementById('close-modal-x'); // Croix
    const saveBtn = document.getElementById('save-profile-btn'); // Bouton Enregistrer
    const cards = document.querySelectorAll('.profile-card');
    const nameInput = document.getElementById('user-name-input');
    
    const storageKey = 'nathan_portfolio_user';
    
    // Variables temporaires pour le choix en cours
    let selectedType = null;
    let savedUser = JSON.parse(localStorage.getItem(storageKey));

    // Mettre à jour l'icône dans le header
    function updateHeaderIcon(type) {
        if(profileTrigger) {
            profileTrigger.innerHTML = ICONS[type] || ICONS['defaut'];
            // Si icône par défaut ou pas de type, pulse animation
            if(!type || type === 'defaut') profileTrigger.classList.add('needs-setup');
            else profileTrigger.classList.remove('needs-setup');
        }
    }

    // Gestion Ouverture/Fermeture
    function openModal() { modal.style.display = 'flex'; }
    function closeModal() { modal.style.display = 'none'; }

    // Init
    if (savedUser) {
        updateHeaderIcon(savedUser.type);
        selectedType = savedUser.type; // Pré-sélection
        sendAnalytics(savedUser, "Visite (Retour)");
    } else {
        updateHeaderIcon('defaut');
        setTimeout(openModal, 3000); // Auto-open
        sendAnalytics({name: "Inconnu", type: "Non défini"}, "Nouvelle Visite");
    }

    // Ouvrir le modal au clic sur l'icône
    profileTrigger.addEventListener('click', () => {
        openModal();
        if(savedUser) {
            nameInput.value = savedUser.name || "";
            // Surligner la carte déjà choisie
            cards.forEach(c => c.classList.remove('selected'));
            const currentCard = document.querySelector(`.profile-card[data-type="${savedUser.type}"]`);
            if(currentCard) currentCard.classList.add('selected');
        }
    });

    // 1. Choix d'une carte (juste visuel pour l'instant)
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedType = card.getAttribute('data-type');
        });
    });

    // 2. Bouton ENREGISTRER (Action finale)
    if(saveBtn) {
        saveBtn.addEventListener('click', () => {
            if(!selectedType) {
                alert("Merci de sélectionner un profil (Curieux, École ou Recruteur)");
                return;
            }
            const name = nameInput.value.trim() || "Anonyme";
            
            // Sauvegarde
            savedUser = { name: name, type: selectedType, lastVisit: new Date().toISOString() };
            localStorage.setItem(storageKey, JSON.stringify(savedUser));

            // UI Updates
            updateHeaderIcon(selectedType);
            closeModal();

            // Notif
            sendAnalytics(savedUser, "Profil Mis à jour");
        });
    }

    // 3. Bouton CROIX (Fermer sans sauver + Pulse)
    if(closeXBtn) {
        closeXBtn.addEventListener('click', () => {
            closeModal();
            // Si pas d'utilisateur sauvé, on fait clignoter l'icone pour dire "eh oh config moi"
            if(!savedUser) profileTrigger.classList.add('needs-setup');
        });
    }

    // Fermer en cliquant en dehors
    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            closeModal();
            if(!savedUser) profileTrigger.classList.add('needs-setup');
        }
    });

    /* --- 2. FONCTIONS D'ENVOI (Analytics) --- */
    function sendAnalytics(user, action) {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const data = {
            name: user.name,
            type: user.type,
            page: currentPage,
            action: action,
            userAgent: navigator.userAgent
        };
        // Google Sheets
        if(GOOGLE_SCRIPT_URL.includes("script.google.com")) {
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST", mode: "no-cors", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }).catch(e => console.error("Erreur Sheets", e));
        }
        // Discord
        if(DISCORD_WEBHOOK_URL.includes("discord")) {
            const discordMsg = { content: `📊 **${action}**\n👤 **${user.name}** (${user.type})\n📍 ${currentPage}` };
            fetch(DISCORD_WEBHOOK_URL, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(discordMsg)
            }).catch(e => console.error("Erreur Discord", e));
        }
    }

    /* --- 3. MACHINE A ECRIRE (Restaurée) --- */
    const textElement = document.getElementById('typewriter-dynamic');
    const cursor = document.getElementById('cursor');
    
    if (textElement && cursor) {
        const phrases = ["une ligne à la fois."];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        let animationStarted = false;
        let animationTimeout;

        gsap.to(cursor, { opacity: 0, ease: "power2.inOut", repeat: -1, yoyo: true, duration: 0.5 });

        function type() {
            if (window.innerWidth <= 800) { animationStarted = false; return; }
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                textElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--; typingSpeed = 50;
            } else {
                textElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++; typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true; typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typingSpeed = 500;
            }
            animationTimeout = setTimeout(type, typingSpeed);
        }

        function checkScreenAndAnimate() {
            if (window.innerWidth <= 800) {
                clearTimeout(animationTimeout); textElement.textContent = phrases[0];
                cursor.style.display = 'none'; animationStarted = false;
            } else {
                cursor.style.display = 'inline-block';
                if (!animationStarted) {
                    charIndex = 0; phraseIndex = 0; isDeleting = false;
                    animationStarted = true; type();
                }
            }
        }
        window.addEventListener('resize', checkScreenAndAnimate);
        checkScreenAndAnimate();
    }

    /* --- 4. COPIE EMAIL & LIEN --- */
    const emailBtn = document.getElementById('copyEmail');
    const emailMsg = document.getElementById('copyMessage');
    const shareBtn = document.getElementById('shareBtn');
    const shareMsg = document.getElementById('shareMessage');
    const myEmail = "nathan07.bergeon@gmail.com";

    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(myEmail).then(() => {
                emailMsg.classList.add('show');
                setTimeout(() => emailMsg.classList.remove('show'), 2000);
            });
        });
    }
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                shareMsg.classList.add('show');
                setTimeout(() => shareMsg.classList.remove('show'), 2000);
            });
        });
    }
    
    /* --- 5. MENU MOBILE --- */
    const menuCheckbox = document.getElementById('menuCheckbox');
    const mobileMenu = document.getElementById('mobileMenu');
    const header = document.querySelector('header');
    
    if(menuCheckbox) {
        menuCheckbox.addEventListener('change', () => {
            if(menuCheckbox.checked) {
                mobileMenu.classList.add('open');
                header.classList.add('nav-active');
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.remove('open');
                header.classList.remove('nav-active');
                document.body.style.overflow = '';
            }
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuCheckbox.checked = false;
                mobileMenu.classList.remove('open');
                header.classList.remove('nav-active');
                document.body.style.overflow = '';
            });
        });
    }
});