// Client-side authentication for demo purposes (localStorage)
// Stores users under 'sb_users' and current session under 'sb_auth'

async function hashPassword(password) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem('sb_users') || '{}');
  } catch (e) {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem('sb_users', JSON.stringify(users));
}

async function registerUser(username, email, password) {
  if (!username || !password) throw new Error('Campo obrigatório');
  const users = loadUsers();
  if (users[username]) throw new Error('Usuário já existe');
  const hash = await hashPassword(password);
  users[username] = { email: email || '', hash };
  saveUsers(users);
  // auto-login after register
  localStorage.setItem('sb_auth', username);
  return true;
}

async function loginUser(username, password) {
  const users = loadUsers();
  const user = users[username];
  if (!user) throw new Error('Usuário não encontrado');
  const hash = await hashPassword(password);
  if (hash !== user.hash) throw new Error('Senha inválida');
  localStorage.setItem('sb_auth', username);
  return true;
}

function logout() {
  localStorage.removeItem('sb_auth');
  // optional: redirect to login
  if (location.pathname.indexOf('login') === -1 && location.pathname.indexOf('signup') === -1) {
    location.href = 'login.html';
  }
}

function currentUser() {
  return localStorage.getItem('sb_auth') || null;
}

function isAuthenticated() {
  const u = currentUser();
  if (!u) return false;
  const users = loadUsers();
  return !!users[u];
}

// Call on protected pages to enforce authentication
function requireAuth() {
  if (!isAuthenticated()) {
    const path = location.pathname.split('/').pop();
    // allow login/signup pages
    if (path !== 'login.html' && path !== 'signup.html') {
      location.href = 'login.html';
    }
  }
}

// Utility: show username if element with id 'sb-username' exists
function injectUsername() {
  const el = document.getElementById('sb-username');
  if (el) {
    el.textContent = currentUser() || '';
  }
}

// Expose functions for inline use
window.auth = {
  registerUser,
  loginUser,
  logout,
  isAuthenticated,
  currentUser,
  requireAuth,
  injectUsername
};
