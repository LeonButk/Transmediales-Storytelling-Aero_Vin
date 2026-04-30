var carousel = document.querySelector('.carousel');
var cells = carousel.querySelectorAll('.carousel__cell, .first_carousel__cell');
var cellCount = 9;
var selectedIndex = 0;
var cellWidth = 0;
var cellHeight = 0;
var isHorizontal = true;
var rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
var radiusSpacingFactor = 1.08;
var radius, theta;
var scene = document.querySelector('.scene');
var descriptionsContainer = document.querySelector('.descriptions');
var descriptionCells = descriptionsContainer ? descriptionsContainer.querySelectorAll('.description_cell, .desciption_cell') : [];
var scrollLock = false;
var scrollLockTimeout = null;
var scrollThreshold = 5;
var scrollLockDuration = 1000;
var defaultIframeSrc = 'https://www.youtube-nocookie.com/embed/HvguTsCrz6U?si=agQxIJnhEPidXTbi';

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

function updateDescriptions() {
    var activeIndex = getActiveCellIndex();
    
    for ( var i=0; i < descriptionCells.length; i++ ) {
        var isActive = i === activeIndex;
        if (isActive) {
            descriptionCells[i].classList.add('is-active');
        } else {
            descriptionCells[i].classList.remove('is-active');
        }
    }
}

function getIframeUrlForCell(cell) {
    if (!cell) {
        return '';
    }

    return cell.dataset.iframeSrc || defaultIframeSrc;
}

function appendAutoplayParameter(url) {
    if (!url) {
        return '';
    }

    var separator = url.indexOf('?') === -1 ? '?' : '&';
    return url + separator + 'autoplay=1';
}

function replaceCellContentWithIframe(cell) {
    if (!cell || cell.dataset.mediaLoaded === 'true') {
        return;
    }

    var iframeUrl = appendAutoplayParameter(getIframeUrlForCell(cell));
    if (!iframeUrl) {
        return;
    }

    cell.innerHTML = '';

    var iframe = document.createElement('iframe');
    iframe.className = 'carousel__iframe';
    iframe.src = iframeUrl;
    iframe.title = cell.dataset.iframeTitle || 'AERO VIN Video';
    iframe.setAttribute('allow', 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    iframe.setAttribute('allowfullscreen', '');

    cell.appendChild(iframe);
    cell.dataset.mediaLoaded = 'true';
    cell.classList.add('has-iframe');
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
    updateDescriptions();
}

function unlockScrollNavigation() {
    scrollLock = false;
    scrollLockTimeout = null;
}

function triggerCarouselScroll(direction) {
    if (scrollLock) {
        return;
    }

    scrollLock = true;

    if (scrollLockTimeout) {
        clearTimeout(scrollLockTimeout);
    }

    if (direction > 0) {
        selectedIndex++;
    } else if (direction < 0) {
        selectedIndex--;
    }

    rotateCarousel();

    scrollLockTimeout = setTimeout(unlockScrollNavigation, scrollLockDuration);
}

if (scene) {
    scene.addEventListener('wheel', function(event) {
        if (Math.abs(event.deltaY) < scrollThreshold) {
            return;
        }

        event.preventDefault();
        triggerCarouselScroll(event.deltaY);
    }, { passive: false });
}

carousel.addEventListener('click', function(event) {
    var clickedCell = event.target.closest('.carousel__cell, .first_carousel__cell');

    if (!clickedCell || !carousel.contains(clickedCell)) {
        return;
    }

    var clickedIndex = Array.prototype.indexOf.call(cells, clickedCell);
    if (clickedIndex !== getActiveCellIndex()) {
        return;
    }

    replaceCellContentWithIframe(clickedCell);
});

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


// set initials
changeCarousel();
