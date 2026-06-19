const horizontalSpeedFactor = 1.5;

// ---------------------------
// HORIZONTAL SECTIONS
// ---------------------------
function setupHorizontalSections() {

    if (window.matchMedia("(pointer: coarse)").matches) return;

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


// ---------------------------
// INTRO TEXT
// ---------------------------
function revealIntroText(){
    const introText = document.querySelector('.introText');
    if (!introText) return;

    gsap.killTweensOf(introText);
    gsap.set(introText, {autoAlpha: 0});

    gsap.to(introText, {
        autoAlpha: 1,
        duration: 1.2,
        ease: 'power2.out',
        delay: 2
    });
}


// ---------------------------
// VERTICAL REVEAL
// ---------------------------
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


// ---------------------------
// FRAME ANIMATION
// ---------------------------
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


// ---------------------------
// FRAME TOGGLE (WIEDERHERGESTELLT)
// ---------------------------
function setupFrameToggle() {
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

    function setFrameVisibility(shouldShow) {
        const isHidden = !shouldShow;

        document.body.classList.toggle('frames-hidden', isHidden);
        document.body.classList.toggle('aeroVin-hidden', isHidden);
        document.body.classList.toggle('momentum-hidden', isHidden);

        if (frameToggle) {
            frameToggle.setAttribute('aria-pressed', String(shouldShow));
            frameToggle.setAttribute(
                'aria-label',
                shouldShow ? 'Rahmen ausblenden' : 'Rahmen einblenden'
            );
        }

        updateFrameToggleImage();
    }

    if (!frameToggle) return;

    const initialVisible = !document.body.classList.contains('frames-hidden');
    setFrameVisibility(initialVisible);

    frameToggle.addEventListener('click', () => {
        const shouldShow = document.body.classList.contains('frames-hidden');
        setFrameVisibility(shouldShow);
    });

    frameToggle.addEventListener('mouseenter', () => updateFrameToggleImage(true));
    frameToggle.addEventListener('mouseleave', () => updateFrameToggleImage(false));
}


// ---------------------------
// MENU SYSTEM
// ---------------------------
function setupMenu() {

    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu__toggle');
    const menuLinks = document.querySelectorAll('.subPage');

    function closeMenu() {
        menu?.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    }

    if (!menu || !menuToggle) return;

    menuToggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        document.body.classList.toggle('menu-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target)) closeMenu();
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            closeMenu();
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}


// ---------------------------
// VIDEO SYSTEM (MOBILE FIX)
// ---------------------------
function setupVideos() {

    const videoThumbButtons = document.querySelectorAll('.video-thumb');

    function startVideo(btn) {
        const videoBlock = btn.closest('.video');
        const iframe = videoBlock?.querySelector('iframe');
        if (!iframe) return;

        const baseSrc = iframe.getAttribute('data-src');
        if (!baseSrc) return;

        const joiner = baseSrc.includes('?') ? '&' : '?';
        const full = baseSrc + joiner + 'autoplay=1&playsinline=1&mute=1&rel=0';

        if (!iframe.getAttribute('src')) {
            iframe.setAttribute('src', full);
        }

        videoBlock.classList.add('is-playing');
        btn.setAttribute('aria-hidden', 'true');
        btn.setAttribute('tabindex', '-1');
    }

    videoThumbButtons.forEach(btn => {
        btn.addEventListener('click', () => startVideo(btn));
        btn.addEventListener('touchend', () => startVideo(btn), { passive: true });
    });
}


// ---------------------------
// INIT
// ---------------------------
document.addEventListener('DOMContentLoaded', function() {

    if (typeof gsap === 'undefined') {
        console.warn('GSAP fehlt');
        return;
    }

    if (gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
    }

    setupFrameAndTextBuildAnimation();
    setupHorizontalSections();
    setupVerticalClassReveal();
    revealIntroText();

    setupMenu();
    setupFrameToggle();
    setupVideos();

    window.addEventListener('resize', () => {
        clearTimeout(window.__resizeTimer);
        window.__resizeTimer = setTimeout(() => {
            setupFrameAndTextBuildAnimation();
            revealIntroText();
        }, 250);
    });
});