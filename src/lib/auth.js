const PUBLIC_COGNITO_DOMAIN = import.meta.env.PUBLIC_COGNITO_DOMAIN;
const PUBLIC_COGNITO_CLIENT_ID = import.meta.env.PUBLIC_COGNITO_CLIENT_ID;
// PUBLIC_API_ENDPOINT and REGION are not needed for this auth flow directly, but keeping imports consistent if needed elsewhere
// const PUBLIC_API_ENDPOINT = import.meta.env.PUBLIC_API_ENDPOINT;
// const PUBLIC_AWS_REGION = import.meta.env.PUBLIC_AWS_REGION;


export const authConfig = {
    domain: PUBLIC_COGNITO_DOMAIN,
    clientId: PUBLIC_COGNITO_CLIENT_ID,
    redirectUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173', // Default to 5173 based on user's setup
    responseType: 'token', // Implicit grant (returns token directly in URL)
    scope: 'email+openid' // Re-enabling email scope as per user confirmation
};

export const login = () => {
    if (!authConfig.domain) {
        alert('Falta configurar PUBLIC_COGNITO_DOMAIN en el archivo .env');
        return;
    }
    // Construct the hosted UI URL
    // Format: https://<your-domain>/login?response_type=token&client_id=<your-app-client-id>&redirect_uri=<your-callback-url>
    const url = `${authConfig.domain}/login?client_id=${authConfig.clientId}&response_type=${authConfig.responseType}&scope=${authConfig.scope}&redirect_uri=${authConfig.redirectUri}`;
    window.location.href = url;
};

export const logout = () => {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
    // Redirect to AWS logout
    // Note: Cognito logout endpoint needs logout_uri, not redirect_uri
    const url = `${authConfig.domain}/logout?client_id=${authConfig.clientId}&logout_uri=${authConfig.redirectUri}`;
    window.location.href = url;
};

export const handleAuthCallback = () => {
    // Parse the URL hash for tokens
    const hash = window.location.hash.substring(1);
    if (!hash) return null;

    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    const accessToken = params.get('access_token');

    if (idToken) {
        localStorage.setItem('id_token', idToken);
        if (accessToken) localStorage.setItem('access_token', accessToken);

        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return idToken;
    }
    return null;
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('id_token');
};

export const getAuthToken = () => {
    return localStorage.getItem('id_token');
};
