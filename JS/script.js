// GSAP Timeline für die SVG-Animation
document.addEventListener('DOMContentLoaded', function() {
    // SVG-Elemente abrufen
    const svg = document.querySelector('#sonne-svg');
    const paths = document.querySelectorAll('.cls-1');
    const circle = document.querySelector('.cls-circle');
    const variablePath = document.querySelector('.cls-1-variable');

    if (!svg || paths.length === 0) {
        console.warn('SVG oder Pfade nicht gefunden');
        return;
    }

    // Timeline erstellen
    const timeline = gsap.timeline({
        repeat: -1, // Endlos wiederholen
        repeatDelay: 3, // 3 Sekunden Pause zwischen den Wiederholungen
    });

    // Jeden Pfad nacheinander animieren (langsamer)
    paths.forEach((path, index) => {
        timeline.to(
            path,
            {
                strokeDashoffset: 0,
                duration: 2.5,
                ease: 'power2.inOut',
            },
            index * 0.4 // Jeder Pfad startet 0.4 Sekunden nach dem vorherigen
        );
    });

    // Variable Linie: Stroke-Width während der Animation stärker ändern
    if (variablePath) {
        timeline.to(
            variablePath,
            {
                attr: { 'stroke-width': 6 },
                duration: 2.5,
                ease: 'power2.inOut',
            },
            paths.length * 0.4 - 1.5 // Gleichzeitig mit der Linie starten
        );
    }

    // Kreis zum Schluss animieren (langsamer)
    timeline.to(
        circle,
        {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.inOut',
        },
        paths.length * 0.4 // Nach allen Pfaden starten
    );

    // Optional: Nach der Animation kurz halten und dann alles zurück
    timeline.to(
        paths,
        {
            strokeDashoffset: 1000,
            duration: 1.5,
            ease: 'power2.inOut',
        },
        '+=1' // Nach 1 Sekunde Pause
    );

    // Variable Linie zurück zu ursprünglicher Dicke
    if (variablePath) {
        timeline.to(
            variablePath,
            {
                attr: { 'stroke-width': 1.5 },
                duration: 1.5,
                ease: 'power2.inOut',
            },
            '-=1.5' // Gleichzeitig mit den anderen Linien zurück
        );
    }

    // Kreis zurück
    timeline.to(
        circle,
        {
            strokeDashoffset: 1000,
            duration: 1.5,
            ease: 'power2.inOut',
        },
        '-=1.5'
    );
});

