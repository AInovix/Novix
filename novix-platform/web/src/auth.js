export const login = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(credentials)
  });
  const { token } = await response.json();
  localStorage.setItem('token', token);
};
