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

// New: Setup frame build animation and text fade-in
function setupFrameAndTextBuildAnimation() {
    if (typeof gsap === 'undefined') return;

    const frames = gsap.utils.toArray('.frame');
    const bigLeft = document.querySelector('.aeroVin');
    const bigRight = document.querySelector('.momentum');

    if (frames.length < 4 || !bigLeft || !bigRight) return;

    const tl = gsap.timeline();

    // Frame 1 (top horizontal) - grow width
    tl.from(frames[0], {
        width: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    // Frame 2 (right vertical) - grow height
    tl.from(frames[1], {
        height: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    // Frame 3 (bottom horizontal) - grow width
    tl.from(frames[2], {
        width: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    // Frame 4 (left vertical) - grow height
    tl.from(frames[3], {
        height: 0,
        duration: 2,
        ease: 'power2.out'
    }, 0);

    // After frames finish, fade in bigLeft and bigRight
    tl.from([bigLeft, bigRight], {
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

    if (menu && menuToggle) {
        const closeMenu = () => {
            menu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('href');
                const target = targetId ? document.querySelector(targetId) : null;

                closeMenu();

                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!menu.contains(event.target)) closeMenu();
        });
    }

    // --- Video thumbnail behaviour: load iframe only on click ---
    const videoThumbButtons = document.querySelectorAll('.video-thumb');
    videoThumbButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const videoBlock = btn.closest('.video');
            if (!videoBlock) return;
            const iframe = videoBlock.querySelector('iframe');
            if (!iframe) return;
            const baseSrc = iframe.getAttribute('data-src');
            if (!baseSrc) return;
            const joiner = baseSrc.includes('?') ? '&' : '?';
            const full = baseSrc + joiner + 'autoplay=1&playsinline=1&rel=0&mute=1';
            if (!iframe.getAttribute('src')) iframe.setAttribute('src', full);
            videoBlock.classList.add('is-playing');
            btn.setAttribute('aria-hidden', 'true');
            btn.setAttribute('tabindex', '-1');
        });
    });

    // register ScrollTrigger (safe to call even if already registered)
    if (gsap && gsap.registerPlugin) gsap.registerPlugin(ScrollTrigger);

    // Setup animations
    if (typeof setupFrameAndTextBuildAnimation === 'function') setupFrameAndTextBuildAnimation();
    if (typeof setupHorizontalSections === 'function') setupHorizontalSections();
    if (typeof setupVerticalClassReveal === 'function') setupVerticalClassReveal();


    // Reset video in #abschnitt1 when leaving the section (so thumbnail returns)
    (function setupResetOnLeave() {
        const abs1 = document.getElementById('abschnitt1');
        if (!abs1 || typeof ScrollTrigger === 'undefined') return;

        function resetVideo() {
            const videoBlock = abs1.querySelector('.video');
            if (!videoBlock) return;
            const iframe = videoBlock.querySelector('iframe');
            const thumb = videoBlock.querySelector('.video-thumb');
            // remove src to stop playback and free resources
            if (iframe && iframe.getAttribute('src')) {
                iframe.removeAttribute('src');
            }
            videoBlock.classList.remove('is-playing');
            if (thumb) {
                thumb.removeAttribute('aria-hidden');
                thumb.removeAttribute('tabindex');
            }
        }

        ScrollTrigger.create({
            trigger: abs1,
            start: 'top top',
            end: 'bottom top',
            onLeave: resetVideo,
            onLeaveBack: resetVideo // also reset if leaving upwards (edge cases)
        });
    })();


});
