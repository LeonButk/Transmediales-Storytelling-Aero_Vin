const horizontalSpeedFactor = 1.8; // Größer = langsameres horizontales Scrollen

// Unterstütze mehrere horizontale Bereiche (.abschnitt--horizontal) und ihre "reverse" Variante
function setupHorizontalSections() {
    const sections = gsap.utils.toArray('.abschnitt--horizontal, .abschnitt--horizontal-reverse');

    sections.forEach(section => {
        const container = section.querySelector('.abschnitt__horizontal');
        if (!container) return;

        const contents = gsap.utils.toArray(container.querySelectorAll('.content'));
        if (!contents.length) return;

        const isReverse = section.classList.contains('abschnitt--horizontal-reverse');
        const xPercentValue = isReverse ? 100 * (contents.length - 1) : -100 * (contents.length - 1);

        gsap.to(contents, {
            xPercent: xPercentValue,
            ease: 'none',
            scrollTrigger: {
                trigger: section,
                pin: true,
                scrub: 0.5,
                end: () => "+=" + (window.innerWidth * (contents.length - 1) * horizontalSpeedFactor)
            }
        });
    });

    /*
snap: {
			snapTo:	1 / (contentsRechts.length - 1),
			duration: 0.5,
			ease: "power1.in",
		},
		end: "+=3500",
 */



    /*
    snap: {
                snapTo:	1 / (contentsLinks.length - 1),
                duration: 0.5,
                ease: "power1.in",
            },
            end: "+=3500",
     */

    // Simple fade-in reveal for elements with .reveal-type
    function setupRevealType() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        const revealEls = document.querySelectorAll('.reveal-type');
        revealEls.forEach(el => {
            gsap.from(el, {
                autoAlpha: 0,
                duration: 3,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 50%',
                    end: 'center',
                    scrub: 0.5,
                    toggleActions: 'play play reverse reverse',
                    markers: false
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupRevealType);
    } else {
        setupRevealType();
    }

}

function revealIntroText(){
    const introText = document.querySelector('.introText');

    if (!introText) return;

    // Ensure any previous tweens are removed and set the element to hidden
    gsap.killTweensOf(introText);
    gsap.set(introText, {autoAlpha: 0});

    // Fade in the introText after the frame animation completes (2 seconds)
    gsap.to(introText, {
        autoAlpha: 1,
        duration: 1.2,
        ease: 'power2.out',
        delay: 2 // Startet nach der Frame-Animation
    });
}

// New: class-based reveal for vertical text paragraphs
function setupVerticalClassReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const els = gsap.utils.toArray('.reveal-vertical-text');
    els.forEach(el => {
        const section = el.closest('.abschnitt');
        if (!section) return;

        gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reset',
                markers: false
            }
        });
    });
}

// Store timeline globally to kill it on resize
let frameAnimationTimeline = null;

// New: Setup frame build animation and text fade-in
function setupFrameAndTextBuildAnimation() {
    if (typeof gsap === 'undefined') return;

    // Kill previous timeline if it exists
    if (frameAnimationTimeline) {
        frameAnimationTimeline.kill();
    }

    const frames = gsap.utils.toArray('.frame');
    const bigLeft = document.querySelector('.aeroVin');
    const bigRight = document.querySelector('.momentum');

    if (frames.length < 4 || !bigLeft || !bigRight) return;

    // Remove any inline width/height left from previous runs so computed (CSS) values
    // reflect the current viewport. This avoids animating to stale px-values.
    frames.forEach(f => {
        f.style.removeProperty('width');
        f.style.removeProperty('height');
    });

    // Force reflow so computed styles are up-to-date
    // eslint-disable-next-line no-unused-expressions
    document.body.offsetHeight;

    // Create a fresh timeline that animates FROM 0 to the element's current computed size
    frameAnimationTimeline = gsap.timeline();

    // Frame 1 (top horizontal) - grow width from 0 to the CSS-sized width
    frameAnimationTimeline.from(frames[0], {
        width: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    // Frame 2 (right vertical) - grow height from 0 to the CSS-sized height
    frameAnimationTimeline.from(frames[1], {
        height: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    // Frame 3 (bottom horizontal) - grow width
    frameAnimationTimeline.from(frames[2], {
        width: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    // Frame 4 (left vertical) - grow height
    frameAnimationTimeline.from(frames[3], {
        height: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    // After frames finish, fade in bigLeft and bigRight
    frameAnimationTimeline.from([bigLeft, bigRight], {
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.out'
    }, 1.5);
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP nicht geladen — Animationen werden nicht ausgeführt.');
        return;
    }

    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu__toggle');
    const menuLinks = document.querySelectorAll('.menu__nav a');

    // --- Language Selection Setup ---
    (function setupLanguageSelection() {
        const languageSelect = document.getElementById('language-select');
        const htmlElement = document.documentElement;
        
        if (!languageSelect) return;
        
        // Map language codes to page URLs
        const languagePages = {
            'de': 'indexGer.html',
            'da': 'index.html',
            'en': 'index.html'
        };
        
        // Get saved language or default to 'de'
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'de';
        
        // Set initial language select value
        languageSelect.value = savedLanguage;
        setLanguageAttribute(savedLanguage);
        
        // Add change listener to select
        languageSelect.addEventListener('change', function() {
            const lang = this.value;
            setLanguageAttribute(lang);
            navigateToLanguagePage(lang);
        });
        
        function setLanguageAttribute(lang) {
            htmlElement.setAttribute('lang', lang);
            localStorage.setItem('selectedLanguage', lang);
            console.log('Sprache geändert zu:', lang);
        }
        
        function navigateToLanguagePage(lang) {
            const page = languagePages[lang];
            if (page) {
                window.location.href = page;
            }
        }
    })();

    if (menu && menuToggle) {
        const closeMenu = () => {
            menu.classList.remove('is-open');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('is-open');
            document.body.classList.toggle('menu-open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href');
                const target = targetId ? document.querySelector(targetId) : null;

                closeMenu();

                if (!target) return;

                // For GSAP-pinned horizontal sections, jump to the ScrollTrigger start
                // so navigation always opens on the first panel/card.
                const isHorizontalSection =
                    target.classList.contains('abschnitt--horizontal') ||
                    target.classList.contains('abschnitt--horizontal-reverse');

                if (isHorizontalSection && typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                    const trigger = ScrollTrigger.getAll().find(st => st.trigger === target && st.pin);
                    if (trigger) {
                        window.scrollTo({
                            top: Math.max(0, trigger.start + 1),
                            behavior: 'smooth'
                        });
                        return;
                    }
                }

                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        document.addEventListener('click', (event) => {
            if (!menu.contains(event.target)) closeMenu();
        });
    }

    // Insert a close button inside the sliding panel (.menu__nav) that mirrors the
    // three-span X from the toggle and closes the menu when clicked.
    (function insertPanelCloseButton(){
        const nav = document.querySelector('.menu__nav');
        if (!nav) return;

        // create button only if it doesn't exist
        if (nav.querySelector('.menu__close')) return;

        const btn = document.createElement('button');
        btn.className = 'menu__close';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Menü schließen');

        // create three spans to form the hamburger/X
        for (let i=0;i<3;i++){
            const s = document.createElement('span');
            btn.appendChild(s);
        }

        nav.appendChild(btn);

        btn.addEventListener('click', function(e){
            e.stopPropagation();
            // close the menu by removing class
            const menuEl = document.querySelector('.menu');
            if (menuEl) {
                menuEl.classList.remove('is-open');
                document.body.classList.remove('menu-open');
                const toggle = menuEl.querySelector('.menu__toggle');
                if (toggle) toggle.setAttribute('aria-expanded', 'false');
            }
        });
    })();

    // --- Video thumbnail behaviour: load iframe only on click ---
    const videoThumbButtons = document.querySelectorAll('.video-thumb');
    const uiElements = document.querySelectorAll('.frame, .menu, .aeroVin, .momentum');
    let isAutoScrolling = false;

    videoThumbButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const videoBlock = btn.closest('.video');
            if (!videoBlock) return;
            const iframe = videoBlock.querySelector('iframe');
            if (!iframe) return;
            const baseSrc = iframe.getAttribute('data-src');
            if (!baseSrc) return;
            const section = videoBlock.closest('.abschnitt');
            if (!section) return;

            const startVideo = () => {
                const joiner = baseSrc.includes('?') ? '&' : '?';
                const full = baseSrc + joiner + 'autoplay=1&playsinline=1&rel=0&mute=1';
                if (!iframe.getAttribute('src')) iframe.setAttribute('src', full);
                videoBlock.classList.add('is-playing');
                btn.setAttribute('aria-hidden', 'true');
                btn.setAttribute('tabindex', '-1');
            };

            // Scroll section into view
            isAutoScrolling = true;
            const isHorizontal = section.classList.contains('abschnitt--horizontal') || section.classList.contains('abschnitt--horizontal-reverse');

            const onComplete = () => {
                // Video erst nach dem Scrollen starten (mit kleinem Delay zur Sicherheit)
                setTimeout(() => {
                    startVideo();
                    setTimeout(() => {
                        isAutoScrolling = false;
                        ScrollTrigger.refresh();
                    }, 200);
                }, 100);
            };

            if (isHorizontal && typeof ScrollTrigger !== 'undefined') {
                // For horizontal pinned sections, we need to find the correct scroll position
                const st = ScrollTrigger.getAll().find(s => s.trigger === section && s.pin === true);
                if (st) {
                    // Find which content card the video is in
                    const contents = gsap.utils.toArray(section.querySelectorAll('.content'));
                    const videoIndex = contents.findIndex(c => c.contains(videoBlock));
                    if (videoIndex !== -1) {
                        const totalWidth = window.innerWidth * (contents.length - 1) * horizontalSpeedFactor;
                        const progress = videoIndex / (contents.length - 1);
                        const targetY = st.start + (progress * totalWidth);

                        console.log("Scrolling horizontal zu:", targetY, "Index:", videoIndex);

                        gsap.to(window, {
                            scrollTo: targetY,
                            duration: 1.2,
                            ease: "power2.inOut",
                            autoKill: false,
                            onStart: () => {
                                // UI sofort ausblenden beim Start des Scrolls
                                gsap.to(uiElements, { autoAlpha: 0, duration: 0.3, overwrite: true });
                            },
                            onComplete: onComplete
                        });
                    } else {
                        console.warn("Video Index nicht gefunden");
                        isAutoScrolling = false;
                        startVideo();
                    }
                } else {
                    console.warn("ScrollTrigger für horizontale Sektion nicht gefunden");
                    isAutoScrolling = false;
                    startVideo();
                }
            } else {
                // Bei vertikalen Sektionen wollen wir das Video perfekt zentrieren (100vh/100vw Gefühl)
                // Wir berechnen die absolute Position des Videos auf der Seite
                const rect = videoBlock.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetY = rect.top + scrollTop - (window.innerHeight - videoBlock.offsetHeight) / 2;

                console.log("Scrolling vertikal zu:", targetY, "Rect Top:", rect.top, "ScrollTop:", scrollTop);

                gsap.to(window, {
                    scrollTo: targetY,
                    duration: 1.2,
                    ease: "power2.inOut",
                    autoKill: false,
                    onStart: () => {
                        gsap.to(uiElements, { autoAlpha: 0, duration: 0.3, overwrite: true });
                    },
                    onComplete: onComplete
                });
            }
        });
    });

    // register ScrollTrigger (safe to call even if already registered)
    if (gsap && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
        if (typeof ScrollToPlugin !== 'undefined') {
            gsap.registerPlugin(ScrollToPlugin);
        }
    }

    // Setup animations
    if (typeof setupFrameAndTextBuildAnimation === 'function') setupFrameAndTextBuildAnimation();
    if (typeof setupHorizontalSections === 'function') setupHorizontalSections();
    if (typeof setupVerticalClassReveal === 'function') setupVerticalClassReveal();
    if (typeof revealIntroText === 'function') revealIntroText();

    // Add resize listener to rebuild frame animation on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (typeof setupFrameAndTextBuildAnimation === 'function') {
                setupFrameAndTextBuildAnimation();
            }
            if (typeof revealIntroText === 'function') {
                revealIntroText();
            }
        }, 250); // Debounce: wait 250ms after resize stops
    });


    // Reset video when leaving the video element (so thumbnail returns)
    (function setupResetOnLeave() {
        if (typeof ScrollTrigger === 'undefined') return;

        const videoBlocks = gsap.utils.toArray('.video');
        const uiElements = document.querySelectorAll('.frame, .menu, .aeroVin, .momentum');

        videoBlocks.forEach(videoBlock => {
            const section = videoBlock.closest('.abschnitt');
            if (!section) return;

            function resetVideo() {
                if (isAutoScrolling) return;

                const iframe = videoBlock.querySelector('iframe');
                const thumb = videoBlock.querySelector('.video-thumb');

                if (videoBlock.classList.contains('is-playing')) {
                    if (iframe && iframe.getAttribute('src')) {
                        iframe.removeAttribute('src');
                    }
                    videoBlock.classList.remove('is-playing');
                    if (thumb) {
                        thumb.removeAttribute('aria-hidden');
                        thumb.removeAttribute('tabindex');
                    }
                }
            }

            const isHorizontal = section.classList.contains('abschnitt--horizontal') || section.classList.contains('abschnitt--horizontal-reverse');

            if (isHorizontal) {
                const contents = gsap.utils.toArray(section.querySelectorAll('.content'));
                const videoIndex = contents.findIndex(c => c.contains(videoBlock));

                ScrollTrigger.create({
                    trigger: section,
                    start: () => {
                        const st = ScrollTrigger.getAll().find(s => s.trigger === section && s.pin === true);
                        if (!st || videoIndex === -1) return "top top";
                        const totalScroll = window.innerWidth * (contents.length - 1) * horizontalSpeedFactor;
                        const cardWidthInScroll = totalScroll / (contents.length - 1);
                        // videoIndex * cardWidthInScroll ist der Punkt im Scroll-Weg, an dem die Karte im Viewport zentriert ist
                        const cardCenter = st.start + (videoIndex * cardWidthInScroll);
                        // Wir verstecken die UI, wenn die Karte zu 25% sichtbar wird
                        return cardCenter - (window.innerWidth * 0.75);
                    },
                    end: () => {
                        const st = ScrollTrigger.getAll().find(s => s.trigger === section && s.pin === true);
                        if (!st || videoIndex === -1) return "bottom top";
                        const totalScroll = window.innerWidth * (contents.length - 1) * horizontalSpeedFactor;
                        const cardWidthInScroll = totalScroll / (contents.length - 1);
                        const cardCenter = st.start + (videoIndex * cardWidthInScroll);
                        // Wir zeigen die UI wieder, wenn die Karte zu 75% den Viewport verlassen hat
                        return cardCenter + (window.innerWidth * 0.75);
                    },
                    onToggle: self => {
                        if (self.isActive) {
                            gsap.to(uiElements, { autoAlpha: 0, duration: 0.5, overwrite: true });
                        } else {
                            resetVideo();
                            // Nur einblenden, wenn kein anderer Video-Trigger aktiv ist
                            const anyActive = ScrollTrigger.getAll().some(st => st.vars.isUiTrigger && st.isActive);
                            if (!anyActive) {
                                gsap.to(uiElements, { autoAlpha: 1, duration: 0.5, overwrite: true });
                            }
                        }
                    },
                    isUiTrigger: true
                });
            } else {
                ScrollTrigger.create({
                    trigger: videoBlock,
                    start: 'top bottom',
                    end: 'bottom top',
                    onToggle: self => {
                        if (self.isActive) {
                            gsap.to(uiElements, { autoAlpha: 0, duration: 0.5, overwrite: true });
                        } else {
                            resetVideo();
                            const anyActive = ScrollTrigger.getAll().some(st => st.vars.isUiTrigger && st.isActive);
                            if (!anyActive) {
                                gsap.to(uiElements, { autoAlpha: 1, duration: 0.5, overwrite: true });
                            }
                        }
                    },
                    isUiTrigger: true
                });
            }
        });
    })();


});
