// GSAP horizontal scroll for section #abschnitt3
const contents = gsap.utils.toArray("#horizontal .content");

gsap.to(contents, {
	xPercent: -100 * (contents.length - 1),
	scrollTrigger: {
		trigger: "#abschnitt3",
		pin: true,
		scrub: 2
	}
});

const contentsLinks = gsap.utils.toArray("#horizontalLinks .content");

gsap.to(contentsLinks, {
	xPercent: 100 * (contentsLinks.length - 1),
	ease: "none",
	scrollTrigger: {
		trigger: "#abschnitt5",
		pin: true,
		scrub: 2,
		snap: 1 / (contentsLinks.length - 1),
		end: "+=3500",
	}
});
document.addEventListener('DOMContentLoaded', function() {
	if (typeof gsap === 'undefined') {
		console.warn('GSAP nicht geladen — Animationen werden nicht ausgeführt.');
		return;
	}

	var section = document.getElementById('abschnitt1');
	if (!section) {
		return;
	}

	var titel = section.querySelector('.titel');
	var teaser = section.querySelector('.teaser');

	// Set initial (hidden, shifted up)
	gsap.set([titel, teaser], {autoAlpha: 0, y: -40});

	// Timeline: titel and teaser appear simultaneously
	var tl = gsap.timeline({paused: true});
	tl.to([titel, teaser], {duration: 1.5, y: 0, autoAlpha: 1, ease: 'power3.out'});

	// IntersectionObserver to trigger when section is visible
	var observer = new IntersectionObserver(function(entries) {
		entries.forEach(function(entry) {
			if (entry.isIntersecting) {
				tl.play();
			} else {
				tl.reverse();
			}
		});
	}, {threshold: 0.25});

	observer.observe(section);
});


