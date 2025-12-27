// src/core/UserManager.js
export class UserManager {
  storageKey: string;
  currentUserKey: string;
  constructor() {
    this.storageKey = 'shawos-users';
    this.currentUserKey = 'shawos-current-user';
  }

  // Get all registered users
  getUsers() {
    const users = localStorage.getItem(this.storageKey);
    return users ? JSON.parse(users) : {};
  }

  // Save users to storage
  saveUsers(users: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  // Check if any user exists
  hasUsers() {
    const users = this.getUsers();
    return Object.keys(users).length > 0;
  }

  // Register new user
  register(username: string, password: string) {
    // Validate username
    if (!username || username.length < 3) {
      return { success: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { success: false, error: 'El usuario solo puede contener letras, números, guiones y guiones bajos' };
    }

    // Validate password
    if (!password || password.length < 4) {
      return { success: false, error: 'La contraseña debe tener al menos 4 caracteres' };
    }

    const users = this.getUsers();

    // Check if user already exists
    if (users[username]) {
      return { success: false, error: 'El usuario ya existe' };
    }

    // Create user
    users[username] = {
      username: username,
      password: this.hashPassword(password),
      createdAt: new Date().toISOString(),
      homeDir: `/users/${username}`
    };

    this.saveUsers(users);

    return { success: true, user: users[username] };
  }

  // Login user
  login(username: string, password: string) {
    const users = this.getUsers();
    const user = users[username];

    if (!user) {
      return { success: false, error: 'Usuario o contraseña incorrectos' };
    }

    if (user.password !== this.hashPassword(password)) {
      return { success: false, error: 'Usuario o contraseña incorrectos' };
    }

    // Save current user
    localStorage.setItem(this.currentUserKey, username);

    return { success: true, user: user };
  }

  // Get current logged in user
  getCurrentUser() {
    const username = localStorage.getItem(this.currentUserKey);
    if (!username) return null;

    const users = this.getUsers();
    return users[username] || null;
  }

  // Logout current user
  logout() {
    localStorage.removeItem(this.currentUserKey);
  }

  // Simple password hashing (for demo purposes)
  // In production, use proper encryption on backend
  hashPassword(password: string) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // Get user's home directory path
  getUserHomeDir(username: string | null = null) {
    const user = username ? this.getUsers()[username] : this.getCurrentUser();
    return user ? user.homeDir : null;
  }
}