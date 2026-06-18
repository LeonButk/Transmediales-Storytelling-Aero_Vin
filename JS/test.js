const horizontalSpeedFactor = 1.5;

// =========================
// HORIZONTAL SECTIONS
// =========================
function setupHorizontalSections() {
    const sections = gsap.utils.toArray('.abschnitt--horizontal, .abschnitt--horizontal-reverse');

    ScrollTrigger.matchMedia({

        "(min-width: 768px)": function () {

            sections.forEach(section => {
                const container = section.querySelector('.abschnitt__horizontal');
                if (!container) return;

                const contents = gsap.utils.toArray(container.querySelectorAll('.content'));
                if (!contents.length) return;

                const isReverse = section.classList.contains('abschnitt--horizontal-reverse');

                const xPercentValue = isReverse
                    ? 100 * (contents.length - 1)
                    : -100 * (contents.length - 1);

                gsap.to(contents, {
                    xPercent: xPercentValue,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        pin: true,
                        scrub: 0.5,
                        invalidateOnRefresh: true,

                        end: () =>
                            "+=" + ((contents.length - 1) * window.innerWidth * horizontalSpeedFactor)
                    }
                });
            });
        },

        "(max-width: 767px)": function () {

            sections.forEach(section => {
                const container = section.querySelector('.abschnitt__horizontal');
                if (!container) return;

                const contents = gsap.utils.toArray(container.querySelectorAll('.content'));
                if (!contents.length) return;

                const isReverse = section.classList.contains('abschnitt--horizontal-reverse');

                const xPercentValue = isReverse
                    ? 100 * (contents.length - 1)
                    : -100 * (contents.length - 1);

                gsap.to(contents, {
                    xPercent: xPercentValue,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: section,
                        pin: true,

                        // FIX: scrub aus → verhindert Mobile lag/jitter
                        scrub: false,

                        invalidateOnRefresh: true,

                        // FIX: stabiler als window.innerWidth
                        end: () =>
                            "+=" + ((contents.length - 1) * section.offsetWidth * 1.2)
                    }
                });
            });
        }
    });

    setupRevealType();
}

// =========================
// REVEAL TYPE
// =========================
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
                toggleActions: 'play play reverse reverse'
            }
        });
    });
}

// =========================
// INTRO TEXT
// =========================
function revealIntroText() {
    const introText = document.querySelector('.introText');
    if (!introText) return;

    gsap.killTweensOf(introText);
    gsap.set(introText, { autoAlpha: 0 });

    gsap.to(introText, {
        autoAlpha: 1,
        duration: 1.2,
        ease: 'power2.out',
        delay: 2
    });
}

// =========================
// VERTICAL REVEAL
// =========================
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
                toggleActions: 'play none none reset'
            }
        });
    });
}

// =========================
// FRAME ANIMATION
// =========================
let frameAnimationTimeline = null;

function setupFrameAndTextBuildAnimation() {
    if (typeof gsap === 'undefined') return;

    if (frameAnimationTimeline) {
        frameAnimationTimeline.kill();
    }

    const frames = gsap.utils.toArray('.frame');
    const bigLeft = document.querySelector('.aeroVin');
    const bigRight = document.querySelector('.momentum');

    if (frames.length < 4 || !bigLeft || !bigRight) return;

    frames.forEach(f => {
        f.style.removeProperty('width');
        f.style.removeProperty('height');
    });

    document.body.offsetHeight;

    frameAnimationTimeline = gsap.timeline();

    frameAnimationTimeline.from(frames[0], {
        width: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    frameAnimationTimeline.from(frames[1], {
        height: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    frameAnimationTimeline.from(frames[2], {
        width: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    frameAnimationTimeline.from(frames[3], {
        height: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    frameAnimationTimeline.from([bigLeft, bigRight], {
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.out'
    }, 1.5);
}

// =========================
// MAIN INIT
// =========================
document.addEventListener('DOMContentLoaded', function () {

    if (typeof gsap === 'undefined') {
        console.warn('GSAP nicht geladen — Animationen werden nicht ausgeführt.');
        return;
    }

    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu__toggle');
    const menuLinks = document.querySelectorAll('.subPage');
    const frameToggle = document.querySelector('.frame-toggle__toggle');
    const frameToggleImg = frameToggle?.querySelector('img');

    function updateFrameToggleImage(isHover = false) {
        if (!frameToggleImg) return;

        const framesVisible = !document.body.classList.contains('frames-hidden');

        if (isHover) {
            frameToggleImg.src = framesVisible
                ? 'ASSETS/IMAGES/FrameAus.svg'
                : 'ASSETS/IMAGES/FrameAn.svg';
        } else {
            frameToggleImg.src = framesVisible
                ? 'ASSETS/IMAGES/FrameAn.svg'
                : 'ASSETS/IMAGES/FrameAus.svg';
        }
    }

    function setFrameVisibility(shouldShowFrames) {
        const isHidden = !shouldShowFrames;

        document.body.classList.toggle('frames-hidden', isHidden);
        document.body.classList.toggle('aeroVin-hidden', isHidden);
        document.body.classList.toggle('momentum-hidden', isHidden);

        if (frameToggle) {
            frameToggle.setAttribute('aria-pressed', String(shouldShowFrames));
        }

        updateFrameToggleImage();
    }

    if (frameToggle) {
        setFrameVisibility(!document.body.classList.contains('frames-hidden'));

        frameToggle.addEventListener('click', () => {
            const shouldShow = document.body.classList.contains('frames-hidden');
            setFrameVisibility(shouldShow);
        });

        frameToggle.addEventListener('mouseenter', () => updateFrameToggleImage(true));
        frameToggle.addEventListener('mouseleave', () => updateFrameToggleImage(false));
    }

    // =========================
    // LANGUAGE
    // =========================
    (function setupLanguageSelection() {
        const languageSelect = document.getElementById('language-select');
        if (!languageSelect) return;

        const languagePages = {
            'de': 'indexGer.html',
            'da': 'index.html',
            'en': 'index.html'
        };

        const saved = localStorage.getItem('selectedLanguage') || 'de';
        languageSelect.value = saved;

        document.documentElement.setAttribute('lang', saved);

        languageSelect.addEventListener('change', function () {
            const lang = this.value;
            localStorage.setItem('selectedLanguage', lang);
            document.documentElement.setAttribute('lang', lang);

            if (languagePages[lang]) {
                window.location.href = languagePages[lang];
            }
        });
    })();

    // =========================
    // MENU
    // =========================
    if (menu && menuToggle) {

        const closeMenu = () => {
            menu.classList.remove('is-open');
            document.body.classList.remove('menu-open');
        };

        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('is-open');
            document.body.classList.toggle('menu-open');
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                closeMenu();

                const target = document.querySelector(link.getAttribute('href'));
                if (!target) return;

                const isHorizontal =
                    target.classList.contains('abschnitt--horizontal') ||
                    target.classList.contains('abschnitt--horizontal-reverse');

                if (isHorizontal) {
                    ScrollTrigger.refresh();
                }

                target.scrollIntoView({ behavior: 'smooth' });
            });
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target)) closeMenu();
        });
    }

    // =========================
    // INIT ANIMATIONS
    // =========================
    setupFrameAndTextBuildAnimation();
    setupHorizontalSections();
    setupVerticalClassReveal();
    revealIntroText();

    // =========================
    // REFRESH (stabilisiert mobile scroll)
    // =========================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 300);
    });

});