const form = document.querySelector('#signup-form');
const errorMessage = document.querySelector('#signup-error');

form.addEventListener('submit', async function (event) {
    event.preventDefault();
    errorMessage.textContent = '';

    const data = new URLSearchParams(new FormData(form));

    try {
    const csrfResponse = await fetch('/api/csrf');

    if (!csrfResponse.ok) {
        errorMessage.textContent = 'Could not prepare signup. Please try again.';
        return;
    }

    const csrf = await csrfResponse.json();

    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            [csrf.headerName]: csrf.token
        },
        body: data
    });

    const result = await response.json();

    if (!response.ok) {
        errorMessage.textContent = result.error || 'Could not create your account.';
        return;
    }

    window.location.href = '/html/login.html';
} catch (error) {
    errorMessage.textContent = 'Could not complete signup. Please try again.';
}
});