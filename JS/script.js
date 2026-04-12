var carousel = document.querySelector('.carousel');
var cells = carousel.querySelectorAll('.carousel__cell');
var cellCount; // cellCount set from cells-range input value
var selectedIndex = 0;
var cellWidth = 0;
var cellHeight = 0;
var isHorizontal = true;
var rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
var radiusSpacingFactor = 1.08;
var radius, theta;
var lightbox = document.querySelector('.lightbox');
var lightboxImage = document.querySelector('.lightbox__image');
var lightboxClose = document.querySelector('.lightbox__close');

function getActiveCellIndex() {
    if (!cellCount) {
        return 0;
    }

    return ((selectedIndex % cellCount) + cellCount) % cellCount;
}

function updateActiveCellInteractivity() {
    var activeIndex = getActiveCellIndex();

    for ( var i=0; i < cells.length; i++ ) {
        var isVisible = i < cellCount;
        var isActive = i === activeIndex;

        cells[i].style.pointerEvents = (isVisible && isActive) ? 'auto' : 'none';
    }
}

function openLightboxFromCell(cell) {
    var image = cell.querySelector('img');

    if (!image) {
        return;
    }

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    lightboxImage.alt = '';
}

function updateDimensions() {
    cellWidth = cells[0].offsetWidth;
    cellHeight = cells[0].offsetHeight;
}

function rotateCarousel() {
    var angle = theta * selectedIndex * -1;
    carousel.style.transform = 'translateZ(' + -radius + 'px) ' +
        rotateFn + '(' + angle + 'deg)';
    updateActiveCellInteractivity();
}

var prevButton = document.querySelector('.previous-button');
prevButton.addEventListener( 'click', function() {
    selectedIndex--;
    rotateCarousel();
});

var nextButton = document.querySelector('.next-button');
nextButton.addEventListener( 'click', function() {
    selectedIndex++;
    rotateCarousel();
});

carousel.addEventListener('click', function(event) {
    var clickedCell = event.target.closest('.carousel__cell');

    if (!clickedCell || !carousel.contains(clickedCell)) {
        return;
    }

    var clickedIndex = Array.prototype.indexOf.call(cells, clickedCell);
    if (clickedIndex !== getActiveCellIndex()) {
        return;
    }

    openLightboxFromCell(clickedCell);
});

var cellsRange = document.querySelector('.cells-range');
cellsRange.addEventListener( 'change', changeCarousel );
cellsRange.addEventListener( 'input', changeCarousel );



function changeCarousel() {
    updateDimensions();
    cellCount = parseInt(cellsRange.value, 10);
    theta = 360 / cellCount;
    var cellSize = isHorizontal ? cellWidth : cellHeight;
    radius = Math.round( ((cellSize / 2) / Math.tan( Math.PI / cellCount )) * radiusSpacingFactor );
    for ( var i=0; i < cells.length; i++ ) {
        var cell = cells[i];
        if ( i < cellCount ) {
            // visible cell
            cell.style.opacity = 1;
            var cellAngle = theta * i;
            cell.style.transform = rotateFn + '(' + cellAngle + 'deg) translateZ(' + radius + 'px)';
        } else {
            // hidden cell
            cell.style.opacity = 0;
            cell.style.transform = 'none';
        }
    }

    rotateCarousel();
}

window.addEventListener( 'resize', function() {
    changeCarousel();
});

var orientationRadios = document.querySelectorAll('input[name="orientation"]');
( function() {
    for ( var i=0; i < orientationRadios.length; i++ ) {
        var radio = orientationRadios[i];
        radio.addEventListener( 'change', onOrientationChange );
    }
})();

function onOrientationChange() {
    var checkedRadio = document.querySelector('input[name="orientation"]:checked');
    isHorizontal = checkedRadio.value === 'horizontal';
    rotateFn = isHorizontal ? 'rotateY' : 'rotateX';

    carousel.classList.toggle('is-horizontal', isHorizontal);
    carousel.classList.toggle('is-vertical', !isHorizontal);

    changeCarousel();
}

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', function(event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
    }
});

// set initials
onOrientationChange();
