
const form = document.querySelector('#login-form');
const errorMessage = document.querySelector('#login-error');

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    errorMessage.textContent = '';

    const data = new URLSearchParams(new FormData(form));
    

    try {
    

    const csrfResponse = await fetch('/api/csrf');


    if (!csrfResponse.ok) {
        errorMessage.textContent = 'Could not prepare login. Please try again.';
        return;
    }
    
    const csrf = await csrfResponse.json();
    const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
        [csrf.headerName]: csrf.token
    },
    body: data
    });

   if (response.status === 401) {
        errorMessage.textContent = 'Incorrect username or password.';
        return;
    }

    if (!response.ok) {
        errorMessage.textContent = 'Could not log in. Please try again.';
        return;
    }

    window.location.href = 'html/map.html';

} catch (error) {
    
    errorMessage.textContent = 'Could not complete login. Please try again.';
}
});