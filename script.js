// GESTION DU MENU MOBILE (FLUIDE & SANS TRAIT)
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
            // Si l'élément cliqué n'est pas un lien <a>
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

// Logique globale pour les boutons de copie (Code et Email)
document.addEventListener('DOMContentLoaded', () => {
    
    // --- CAS 1 : Boutons de code classiques (ex: maison.html) ---
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

    // --- CAS 2 : Bouton Email spécifique ---
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

    // --- CAS 3 : Bouton Partager spécifique ---
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

    // Fonction utilitaire pour l'animation des boutons de code
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

//  Logique de la machine à écrire 
document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typewriter-dynamic');
    const cursor = document.getElementById('cursor');
    
    if (!textElement || !cursor) {
        return; 
    }

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