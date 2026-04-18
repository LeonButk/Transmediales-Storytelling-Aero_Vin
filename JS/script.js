var carousel = document.querySelector('.carousel');
var cells = carousel.querySelectorAll('.carousel__cell, .first_carousel__cell');
var cellCount; // cellCount set from cells-range input value
var selectedIndex = 0;
var cellWidth = 0;
var cellHeight = 0;
var isHorizontal = true;
var rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
var radiusSpacingFactor = 1.08;
var radius, theta;
var lightbox = document.querySelector('.lightbox');
var lightboxVideo = document.querySelector('.lightbox__video');
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

function getLightboxVideoUrl() {
    if (!lightboxVideo) {
        return '';
    }

    var baseUrl = lightboxVideo.dataset.src || '';
    if (!baseUrl) {
        return '';
    }

    var separator = baseUrl.indexOf('?') === -1 ? '?' : '&';
    return baseUrl + separator + 'autoplay=1';
}

function openLightboxFromCell() {
    if (!lightbox || !lightboxVideo) {
        return;
    }

    var videoUrl = getLightboxVideoUrl();
    if (!videoUrl) {
        return;
    }

    lightboxVideo.src = videoUrl;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
    if (!lightbox || !lightboxVideo) {
        return;
    }

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxVideo.src = '';
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

/*
if(selectedIndex > 0){
        selectedIndex--;
        rotateCarousel();
    }
 */

var nextButton = document.querySelector('.next-button');
nextButton.addEventListener( 'click', function() {
    selectedIndex++;
    rotateCarousel();
});

carousel.addEventListener('click', function(event) {
    var clickedCell = event.target.closest('.carousel__cell, .first_carousel__cell');

    if (!clickedCell || !carousel.contains(clickedCell)) {
        return;
    }

    var clickedIndex = Array.prototype.indexOf.call(cells, clickedCell);
    if (clickedIndex !== getActiveCellIndex()) {
        return;
    }

    openLightboxFromCell(clickedCell);
});

var cellCount = 9;



function changeCarousel() {
    updateDimensions();
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


if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
        closeLightbox();
    }
});

// set initials
changeCarousel();
