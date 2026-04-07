export function getUser() {
  const saved = localStorage.getItem('novella_user');
  return saved ? JSON.parse(saved) : null;
}

export function setUser(user, token) {
  localStorage.setItem('novella_user', JSON.stringify(user));
  localStorage.setItem('novella_token', token);
}

export function logout() {
  localStorage.removeItem('novella_user');
  localStorage.removeItem('novella_token');
}
