document.addEventListener("DOMContentLoaded", () => {
    // getDay() returns 0 (Sun) to 6 (Sat)
    //const today = new Date().getDay(); 
    const today = 2

    
    // Dictionary mapping the day number to your HTML IDs
    const dayMap = {
        1: 'mon',
        2: 'tues',
        3: 'wed',
        4: 'thurs',
        5: 'fri'
    };

    // If today is in the dictionary
    if (dayMap[today]) {
        const dayId = dayMap[today];
        
        document.getElementById(`${dayId}-head`).classList.add('active');
        document.getElementById(`${dayId}-col`).classList.add('active-bg');
    }
});



// Popup Menu Activation
document.querySelector('#add-btn').addEventListener('click', function() {

    // Adds the open class to the html marker popup, allowing it to slide up and be visible
    document.getElementById('marker-popup').classList.add('open');
    document.getElementById('scheduleArea').classList.add('blur-active');

});
document.getElementById('marker-popup').addEventListener('click', (e) => {
    e.stopPropagation();
});
document.getElementById('scheduleArea').addEventListener('click', (e) => {
    document.getElementById('marker-popup').classList.remove('open');
    document.getElementById('scheduleArea').classList.remove('blur-active');
});






// Draggable Handle Code, parts obtained from a stack overflow
const popup = document.getElementById('marker-popup');
const dragHandle = popup.querySelector('.drag-handle');
const scheduleArea = document.getElementById('scheduleArea');

let startY = 0;
let currentDeltaY = 0;
let isDragging = false;

dragHandle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startY = e.clientY;
    currentDeltaY = 0;
    popup.classList.add('dragging');
    dragHandle.setPointerCapture(e.pointerId); // Keeps tracking even if finger slides off the handle
});

dragHandle.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    // Clamp at 0 so dragging upward does nothing
    currentDeltaY = Math.max(0, e.clientY - startY);
    popup.style.transform = `translateY(${currentDeltaY}px)`;
});

function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;

    popup.classList.remove('dragging');
    if (dragHandle.hasPointerCapture(e.pointerId)) {
        dragHandle.releasePointerCapture(e.pointerId);
    }

    // Close if dragged down more than 100px (25%)
    if (currentDeltaY > Math.min(120, popup.offsetHeight * 0.25)) {
        popup.classList.remove('open');
        scheduleArea.classList.remove('blur-active');
    }

    // Activate the CSS transform
    popup.style.transform = '';
    currentDeltaY = 0;
}
// Detects finishing the mouse event and calls the function to determine to close or not
dragHandle.addEventListener('pointerup', endDrag);
dragHandle.addEventListener('pointercancel', endDrag);