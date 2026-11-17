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



// Popup Menu
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