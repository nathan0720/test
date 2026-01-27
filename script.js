// GESTION DU MENU MOBILE
document.addEventListener('DOMContentLoaded', () => {
    const menuCheckbox = document.getElementById('menuCheckbox');
    const menu = document.getElementById('mobileMenu');
    const header = document.querySelector('header');

    const closeMenu = () => {
        menu.classList.remove('open');
        header.classList.remove('nav-active');
        menuCheckbox.checked = false;
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        menu.classList.add('open');
        header.classList.add('nav-active');
        document.body.style.overflow = 'hidden';
    };

    if (menuCheckbox && menu) {
        menuCheckbox.addEventListener('change', () => {
            if (menuCheckbox.checked) openMenu();
            else closeMenu();
        });

        menu.addEventListener('click', (event) => {
            if (event.target.tagName !== 'A') {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMenu(); 
            }
        });
        
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeMenu());
        });
    }
});

// Logique globale pour les boutons de copie
document.addEventListener('DOMContentLoaded', () => {
    const codeButtons = document.querySelectorAll('.copy-btn');
    codeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const codeBlock = document.getElementById(targetId);

            if (codeBlock) {
                const codeText = codeBlock.textContent.trim();
                copyToClipboard(codeText, button);
            }
        });
    });

    const emailBtn = document.getElementById('copyEmail');
    const emailMsg = document.getElementById('copyMessage');
    const myEmail = "nathan07.bergeon@gmail.com";

    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(myEmail).then(() => {
                emailMsg.classList.add('show');
                setTimeout(() => emailMsg.classList.remove('show'), 2000);
            });
        });
    }

    const shareBtn = document.getElementById('shareBtn');
    const shareMsg = document.getElementById('shareMessage');

    if (shareBtn && shareMsg) {
        shareBtn.addEventListener('click', () => {
            const siteUrl = window.location.href;
            navigator.clipboard.writeText(siteUrl).then(() => {
                shareMsg.classList.add('show');
                setTimeout(() => {
                    shareMsg.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie du lien : ', err);
            });
        });
    }

    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = button.innerHTML;
            button.classList.add('copied');
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> Copié !';
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = originalHTML;
            }, 2000);
        }).catch(err => console.error('Erreur copie: ', err));
    }
});

// Machine à écrire
document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriter-dynamic');
    const cursor = document.getElementById('cursor');
    
    if (!textElement || !cursor) return; 

    const phrases = ["une ligne à la fois."];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let animationStarted = false;
    let animationTimeout;

    gsap.to(cursor, {
        opacity: 0,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        duration: 0.5
    });

    function type() {
        if (window.innerWidth <= 800) {
            animationStarted = false;
            return;
        }

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        animationTimeout = setTimeout(type, typingSpeed);
    }

    function checkScreenAndAnimate() {
        if (window.innerWidth <= 800) {
            clearTimeout(animationTimeout);
            textElement.textContent = phrases[0];
            cursor.style.display = 'none';
            animationStarted = false;
        } else {
            cursor.style.display = 'inline-block';
            if (!animationStarted) {
                charIndex = 0;
                phraseIndex = 0;
                isDeleting = false;
                animationStarted = true;
                type();
            }
        }
    }

    window.addEventListener('resize', checkScreenAndAnimate);
    checkScreenAndAnimate();
});

// --- SYSTÈME DE NOTIFICATION DISCORD ET MODAL ---
const DISCORD_URL = "https://discordapp.com/api/webhooks/1465838008958980128/BYgFcckr5DD_TnGw3nSRC-C5P0h9qfulOZ5lX_msCKTrLvbckof1lFq51lQNNNSZyse7";

async function notifyDiscord(message) {
    try {
        await fetch(DISCORD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message })
        });
    } catch (e) { console.error("Erreur Discord:", e); }
}

window.addEventListener('load', () => {
    // Éléments du nouveau modal
    const modal = document.getElementById('profile-modal');
    const profileTrigger = document.getElementById('profileTrigger');
    const closeBtn = document.getElementById('close-modal-btn');
    const nameInput = document.getElementById('user-name-input');
    const cards = document.querySelectorAll('.profile-card');
    
    const storageKey = 'nathan_portfolio_user';
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    let savedUser = JSON.parse(localStorage.getItem(storageKey));

    // FONCTION : Ouvrir le modal
    function openModal() {
        if(modal) modal.style.display = 'flex';
        // Pré-remplir si existe
        if (savedUser && nameInput) {
            nameInput.value = savedUser.name;
        }
    }

    // FONCTION : Fermer le modal
    function closeModal() {
        if(modal) modal.style.display = 'none';
    }

    // 1. Gestion de l'ouverture automatique ou manuelle
    if (!savedUser) {
        // Premier visiteur : on ouvre le modal
        setTimeout(openModal, 1000); 
    } else {
        // Visiteur connu : notification retour
        savedUser.visits += 1;
        localStorage.setItem(storageKey, JSON.stringify(savedUser));
        notifyDiscord(`🔄 **RETOUR**\n👤 **${savedUser.name}** (${savedUser.type})\n🔢 **Visite n°** : ${savedUser.visits}\n📍 **Page** : \`${currentPage}\``);
    }

    // Bouton Header pour changer de profil
    if (profileTrigger) {
        profileTrigger.addEventListener('click', openModal);
    }

    // Bouton Fermer
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Clic sur une carte de profil
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-type');
            const name = nameInput.value.trim() || "Anonyme";
            
            // Mise à jour ou création user
            const userData = { 
                name: name, 
                type: type, 
                visits: savedUser ? savedUser.visits : 1 
            };
            
            localStorage.setItem(storageKey, JSON.stringify(userData));
            savedUser = userData; // Mettre à jour la var locale

            closeModal();

            // Notification Discord adaptée
            const emoji = type === "Ecole" ? "🎓" : (type === "Entreprise" ? "💼" : "👋");
            notifyDiscord(`🚀 **PROFIL DÉFINI**\n👤 **Nom** : ${name}\n${emoji} **Type** : ${type}\n📄 **Page** : \`${currentPage}\``);
        });
    });

    // Suivi de navigation
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('href');
            const user = JSON.parse(localStorage.getItem(storageKey)) || { name: "Inconnu" };
            if (target && !target.startsWith('http') && target !== "#") {
                notifyDiscord(`👀 **NAVIGATION** : **${user.name}** va vers \`${target}\``);
            }
        });
    });
});