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
function revealIntroText() {
    const introText = document.querySelector('.introText');
    if (!introText) return;

    gsap.killTweensOf(introText);
    gsap.set(introText, { autoAlpha: 0 });

    gsap.to(introText, {
        autoAlpha: 1,
        duration: 1.2,
        delay: 2,
        ease: "power2.out"
    });
}


// ---------------------------
// VERTICAL REVEAL
// ---------------------------
function setupVerticalClassReveal() {
    if (!gsap || !ScrollTrigger) return;

    gsap.utils.toArray('.reveal-vertical-text').forEach(el => {
        const section = el.closest('.abschnitt');
        if (!section) return;

        gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reset"
            }
        });
    });
}


// ---------------------------
// FRAME ANIMATION
// ---------------------------
let frameTimeline = null;

function setupFrameAndTextBuildAnimation() {
    if (!gsap) return;

    if (frameTimeline) frameTimeline.kill();

    const frames = gsap.utils.toArray('.frame');
    const bigLeft = document.querySelector('.aeroVin');
    const bigRight = document.querySelector('.momentum');

    if (frames.length < 4 || !bigLeft || !bigRight) return;

    frames.forEach(f => {
        f.style.removeProperty("width");
        f.style.removeProperty("height");
    });

    document.body.offsetHeight;

    frameTimeline = gsap.timeline();

    frameTimeline.from(frames[0], { width: 0, duration: 2 }, 0);
    frameTimeline.from(frames[1], { height: 0, duration: 2 }, 0);
    frameTimeline.from(frames[2], { width: 0, duration: 2 }, 0);
    frameTimeline.from(frames[3], { height: 0, duration: 2 }, 0);

    frameTimeline.from([bigLeft, bigRight], {
        autoAlpha: 0,
        duration: 1
    }, 1.5);
}


// ---------------------------
// FRAME TOGGLE
// ---------------------------
function setupFrameToggle() {

    const btn = document.querySelector('.frame-toggle__toggle');
    const img = btn?.querySelector('img');

    if (!btn) return;

    function update(isHover = false) {
        const visible = !document.body.classList.contains('frames-hidden');

        if (!img) return;

        img.src = isHover
            ? (visible ? 'ASSETS/IMAGES/FrameAus.svg' : 'ASSETS/IMAGES/FrameAn.svg')
            : (visible ? 'ASSETS/IMAGES/FrameAn.svg' : 'ASSETS/IMAGES/FrameAus.svg');
    }

    function setVisible(show) {
        document.body.classList.toggle('frames-hidden', !show);
        document.body.classList.toggle('aeroVin-hidden', !show);
        document.body.classList.toggle('momentum-hidden', !show);

        btn.setAttribute("aria-pressed", String(show));
        update();
    }

    setVisible(!document.body.classList.contains('frames-hidden'));

    btn.addEventListener('click', () => {
        const show = document.body.classList.contains('frames-hidden');
        setVisible(show);
    });

    btn.addEventListener('mouseenter', () => update(true));
    btn.addEventListener('mouseleave', () => update(false));
}


// ---------------------------
// MENU SYSTEM (FIXED HORIZONTAL JUMP)
// ---------------------------
function setupMenu() {

    const menu = document.querySelector('.menu');
    const toggle = document.querySelector('.menu__toggle');
    const links = document.querySelectorAll('.subPage');

    if (!menu || !toggle) return;

    const closeMenu = () => {
        menu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        document.body.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
    });

    document.addEventListener('click', e => {
        if (!menu.contains(e.target)) closeMenu();
    });

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();

            const target = document.querySelector(link.getAttribute('href'));
            closeMenu();

            if (!target) return;

            const isHorizontal =
                target.classList.contains('abschnitt--horizontal') ||
                target.classList.contains('abschnitt--horizontal-reverse');

            // 🔥 FIX: correct landing on pinned GSAP sections
            if (isHorizontal && typeof ScrollTrigger !== 'undefined') {

                ScrollTrigger.refresh();

                const st = ScrollTrigger.getAll()
                    .find(t => t.trigger === target && t.pin);

                if (st) {
                    window.scrollTo({
                        top: st.start + 2,
                        behavior: 'smooth'
                    });
                    return;
                }
            }

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}


// ---------------------------
// VIDEO SYSTEM (NO SCROLL + MOBILE FIX)
// ---------------------------
function setupVideos() {

    const buttons = document.querySelectorAll('.video-thumb');

    function play(btn) {
        const block = btn.closest('.video');
        const iframe = block?.querySelector('iframe');
        if (!iframe) return;

        const base = iframe.dataset.src;
        const url = base + (base.includes('?') ? '&' : '?') +
            'autoplay=1&playsinline=1&mute=1&rel=0';

        if (!iframe.src) iframe.src = url;

        block.classList.add('is-playing');
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => play(btn));
        btn.addEventListener('touchend', () => play(btn), { passive: true });
    });
}


// ---------------------------
// LANGUAGE SWITCH (RESTORED)
// ---------------------------
function setupLanguageSelection() {

    const select = document.getElementById('language-select');
    const html = document.documentElement;

    if (!select) return;

    const pages = {
        de: "indexDE.html",
        en: "index.html",
        da: "indexDA.html"
    };

    const saved = localStorage.getItem("selectedLanguage") || "de";

    select.value = saved;
    html.setAttribute("lang", saved);

    select.addEventListener("change", function () {
        const lang = this.value;

        localStorage.setItem("selectedLanguage", lang);
        html.setAttribute("lang", lang);

        const page = pages[lang];
        if (page) window.location.href = page;
    });
}


// ---------------------------
// INIT
// ---------------------------
document.addEventListener('DOMContentLoaded', () => {

    if (gsap?.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
    }

    setupHorizontalSections();
    setupVerticalClassReveal();
    setupFrameAndTextBuildAnimation();
    revealIntroText();

    setupMenu();
    setupFrameToggle();
    setupVideos();
    setupLanguageSelection();

    window.addEventListener('resize', () => {
        clearTimeout(window.__t);
        window.__t = setTimeout(() => {
            setupFrameAndTextBuildAnimation();
            revealIntroText();
        }, 250);
    });
});