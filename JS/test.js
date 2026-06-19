const horizontalSpeedFactor = 1.5;

/* ---------------------------
   HORIZONTAL SECTIONS
---------------------------- */
function setupHorizontalSections() {

    if (window.matchMedia("(max-width: 1024px)").matches) return;

    const sections = gsap.utils.toArray(
        '.abschnitt--horizontal, .abschnitt--horizontal-reverse'
    );

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
            ease: "none",
            scrollTrigger: {
                trigger: section,
                pin: true,
                scrub: 0.5,
                end: () =>
                    "+=" + (window.innerWidth * (contents.length - 1) * horizontalSpeedFactor)
            }
        });
    });
}

/* ---------------------------
   REVEAL TYPE
---------------------------- */
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
                end: 'center',
                scrub: 0.5
            }
        });
    });
}

/* ---------------------------
   INTRO TEXT
---------------------------- */
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

/* ---------------------------
   VERTICAL REVEAL
---------------------------- */
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

/* ---------------------------
   FRAME ANIMATION
---------------------------- */
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

    frameAnimationTimeline.from(frames[0], { width: 0, duration: 2, ease: 'power2.out' }, 0);
    frameAnimationTimeline.from(frames[1], { height: 0, duration: 2, ease: 'power2.out' }, 0);
    frameAnimationTimeline.from(frames[2], { width: 0, duration: 2, ease: 'power2.out' }, 0);
    frameAnimationTimeline.from(frames[3], { height: 0, duration: 2, ease: 'power2.out' }, 0);

    frameAnimationTimeline.from([bigLeft, bigRight], {
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.out'
    }, 1.5);
}

/* ---------------------------
   MENU CLOSE BUTTON (X FIX)
---------------------------- */
function insertPanelCloseButton() {
    const nav = document.querySelector('.menu__nav');
    if (!nav || nav.querySelector('.menu__close')) return;

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

        const menu = document.querySelector('.menu');
        if (!menu) return;

        menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');

        const toggle = menu.querySelector('.menu__toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
}

/* ---------------------------
   MAIN INIT
---------------------------- */
document.addEventListener('DOMContentLoaded', function () {

    if (typeof gsap === 'undefined') return;

    const menu = document.querySelector('.menu');
    const menuToggle = document.querySelector('.menu__toggle');
    const menuLinks = document.querySelectorAll('.subPage');

    const frameToggle = document.querySelector('.frame-toggle__toggle');
    const frameToggleImg = frameToggle?.querySelector('img');

    /* ---------------------------
       FRAME TOGGLE
    ---------------------------- */
    function updateFrameToggleImage(isHover = false) {
        if (!frameToggleImg) return;

        const visible = !document.body.classList.contains('frames-hidden');

        frameToggleImg.src = isHover
            ? (visible ? 'ASSETS/IMAGES/FrameAus.svg' : 'ASSETS/IMAGES/FrameAn.svg')
            : (visible ? 'ASSETS/IMAGES/FrameAn.svg' : 'ASSETS/IMAGES/FrameAus.svg');
    }

    function setFrameVisibility(show) {
        const hidden = !show;

        document.body.classList.toggle('frames-hidden', hidden);
        document.body.classList.toggle('aeroVin-hidden', hidden);
        document.body.classList.toggle('momentum-hidden', hidden);

        if (frameToggle) {
            frameToggle.setAttribute('aria-pressed', String(show));
        }

        updateFrameToggleImage();
    }

    if (frameToggle) {
        setFrameVisibility(true);

        frameToggle.addEventListener('click', () => {
            const show = document.body.classList.contains('frames-hidden');
            setFrameVisibility(show);
        });

        frameToggle.addEventListener('mouseenter', () => updateFrameToggleImage(true));
        frameToggle.addEventListener('mouseleave', () => updateFrameToggleImage(false));
    }

    /* ---------------------------
       LANGUAGE SWITCH
    ---------------------------- */
    (function setupLanguageSelection() {
        const select = document.getElementById('language-select');
        if (!select) return;

        const pages = {
            de: 'indexDE.html',
            da: 'indexDA.html',
            en: 'index.html'
        };

        const saved = localStorage.getItem('selectedLanguage') || 'de';

        select.value = saved;
        document.documentElement.setAttribute('lang', saved);

        select.addEventListener('change', function () {
            const lang = this.value;
            localStorage.setItem('selectedLanguage', lang);
            document.documentElement.setAttribute('lang', lang);

            if (pages[lang]) window.location.href = pages[lang];
        });
    })();

    /* ---------------------------
       MENU BEHAVIOR
    ---------------------------- */
    if (menu && menuToggle) {

        const closeMenu = () => {
            menu.classList.remove('is-open');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', () => {
            const open = menu.classList.toggle('is-open');
            document.body.classList.toggle('menu-open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const target = document.querySelector(link.getAttribute('href'));
                closeMenu();

                if (!target) return;

                const isHorizontal =
                    target.classList.contains('abschnitt--horizontal') ||
                    target.classList.contains('abschnitt--horizontal-reverse');

                if (isHorizontal && typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();

                    const st = ScrollTrigger.getAll()
                        .find(s => s.trigger === target && s.pin);

                    if (st) {
                        window.scrollTo({
                            top: Math.max(0, st.start + 1),
                            behavior: 'smooth'
                        });
                        return;
                    }
                }

                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target)) closeMenu();
        });
    }

    /* ---------------------------
       CLOSE BUTTON INSERT
    ---------------------------- */
    insertPanelCloseButton();

    /* ---------------------------
       VIDEO (NO SCROLL)
    ---------------------------- */
    document.querySelectorAll('.video-thumb').forEach(btn => {
        btn.addEventListener('click', () => {

            const video = btn.closest('.video');
            const iframe = video?.querySelector('iframe');

            if (!iframe) return;

            const src = iframe.getAttribute('data-src');
            if (!src) return;

            if (!iframe.src) {
                iframe.src = src + '?autoplay=1&playsinline=1&rel=0&mute=1';
            }

            video.classList.add('is-playing');
            btn.setAttribute('aria-hidden', 'true');
        });
    });

    /* ---------------------------
       INIT ANIMATIONS
    ---------------------------- */
    if (typeof setupFrameAndTextBuildAnimation === 'function') setupFrameAndTextBuildAnimation();
    if (typeof setupHorizontalSections === 'function') setupHorizontalSections();
    if (typeof setupVerticalClassReveal === 'function') setupVerticalClassReveal();
    if (typeof revealIntroText === 'function') revealIntroText();

    window.addEventListener('resize', () => {
        clearTimeout(window._resizeT);
        window._resizeT = setTimeout(() => {
            setupFrameAndTextBuildAnimation();
            revealIntroText();
        }, 250);
    });
});