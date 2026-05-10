// GSAP slide-in for section #abschnitt1
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


