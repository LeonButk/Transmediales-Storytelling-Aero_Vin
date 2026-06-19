const horizontalSpeedFactor = 1.5;

// -----------------------------
// HORIZONTAL SECTIONS
// -----------------------------
function setupHorizontalSections() {

    if (window.matchMedia("(pointer: coarse)").matches) {
        return;
    }

    const sections = gsap.utils.toArray(
        '.abschnitt--horizontal, .abschnitt--horizontal-reverse'
    );

    sections.forEach(section => {
        const container = section.querySelector('.abschnitt__horizontal');
        if (!container) return;

        const contents = gsap.utils.toArray(
            container.querySelectorAll('.content')
        );

        if (!contents.length) return;

        const isReverse = section.classList.contains('abschnitt--horizontal-reverse');

        const xPercentValue = isReverse
            ? 100 * (contents.length - 1)
            : -100 * (contents.length - 1);

        gsap.to(contents, {
            xPercent: xPercentValue,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                pin: true,
                scrub: 0.5,
                end: () =>
                    "+=" +
                    (window.innerWidth *
                        (contents.length - 1) *
                        horizontalSpeedFactor)
            }
        });
    });
}

// -----------------------------
// REVEAL TYPE
// -----------------------------
function setupRevealType() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('.reveal-type').forEach(el => {
        gsap.from(el, {
            autoAlpha: 0,
            duration: 3,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 50%',
                scrub: 0.5,
                toggleActions: 'play play reverse reverse'
            }
        });
    });
}

// -----------------------------
// INTRO TEXT
// -----------------------------
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

// -----------------------------
// VERTICAL REVEAL
// -----------------------------
function setupVerticalClassReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.utils.toArray('.reveal-vertical-text').forEach(el => {
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

// -----------------------------
// FRAME ANIMATION
// -----------------------------
let frameAnimationTimeline = null;

function setupFrameAndTextBuildAnimation() {
    if (typeof gsap === 'undefined') return;

    if (frameAnimationTimeline) frameAnimationTimeline.kill();

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

    frameAnimationTimeline.from(frames[0], { width: 0, duration: 2 }, 0);
    frameAnimationTimeline.from(frames[1], { height: 0, duration: 2 }, 0);
    frameAnimationTimeline.from(frames[2], { width: 0, duration: 2 }, 0);
    frameAnimationTimeline.from(frames[3], { height: 0, duration: 2 }, 0);

    frameAnimationTimeline.from([bigLeft, bigRight], {
        autoAlpha: 0,
        duration: 1
    }, 1.5);
}

// -----------------------------
// MENU SYSTEM (STABLE)
// -----------------------------
function initMenuSystem() {

    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu__toggle');

    if (!menu || !menuToggle) return;

    const closeMenu = () => {
        menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
        menu.classList.add('is-open');
        document.body.classList.add('menu-open');
        menuToggle.setAttribute('aria-expanded', 'true');
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = menu.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) {
            closeMenu();
        }
    });

    // ensure close button exists ALWAYS
    const nav = document.querySelector('.menu__nav');

    if (nav && !nav.querySelector('.menu__close')) {
        const btn = document.createElement('button');
        btn.className = 'menu__close';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Menü schließen');

        for (let i = 0; i < 3; i++) {
            btn.appendChild(document.createElement('span'));
        }

        nav.appendChild(btn);

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMenu();
        });
    }
}

// -----------------------------
// VIDEO (MOBILE AUTOPLAY FIX + NO SCROLL)
// -----------------------------
function initVideo() {

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const videoThumbButtons = document.querySelectorAll('.video-thumb');

    videoThumbButtons.forEach(btn => {

        btn.addEventListener('click', () => {

            const videoBlock = btn.closest('.video');
            if (!videoBlock) return;

            const iframe = videoBlock.querySelector('iframe');
            if (!iframe) return;

            const baseSrc = iframe.getAttribute('data-src');
            if (!baseSrc) return;

            const startVideo = () => {

                const joiner = baseSrc.includes('?') ? '&' : '?';
                const full = baseSrc + joiner + 'autoplay=1&playsinline=1&rel=0&mute=1';

                // MOBILE FIX (iOS + Android reliable reload)
                if (isMobile) {
                    iframe.src = "";
                    setTimeout(() => {
                        iframe.src = full;
                    }, 50);
                } else {
                    if (!iframe.getAttribute('src')) {
                        iframe.setAttribute('src', full);
                    }
                }

                videoBlock.classList.add('is-playing');

                btn.setAttribute('aria-hidden', 'true');
                btn.setAttribute('tabindex', '-1');
            };

            // NO SCROLL ANYMORE
            startVideo();
        });
    });
}

// -----------------------------
// INIT
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    setupFrameAndTextBuildAnimation();
    setupHorizontalSections();
    setupVerticalClassReveal();
    revealIntroText();

    initMenuSystem();
    initVideo();

    window.addEventListener('resize', () => {
        setTimeout(() => {
            setupFrameAndTextBuildAnimation();
            revealIntroText();
        }, 250);
    });
});