const adminAuthProvider = {
  login: ({ username, password }) => {
    const request = new Request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText)
        }
        return response.json()
      })
      .then((auth) => {
        localStorage.setItem('auth', JSON.stringify(auth))
      })
      .catch(() => {
        throw new Error('Network error')
      })
  },
  checkError: (error) => {
    const status = error.status
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth')
      return Promise.reject()
    }
    // other error code (404, 500, etc): no need to log out
    const data = localStorage.getItem('auth')
    if (data === null) return Promise.reject()
    const auth = JSON.parse(data)
    if (!auth?.token) return Promise.reject()

    return Promise.resolve()
  },
  logout: () => {
    const request = new Request('/api/auth/logout', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
    return fetch(request)
      .then(() => {
        localStorage.removeItem('auth')
      })
      .catch(() => {
        throw new Error('Network error')
      })
  },
  checkAuth: () => {
    const data = localStorage.getItem('auth')
    if (data === null) return Promise.reject()
    const auth = JSON.parse(data)
    if (!auth?.token) return Promise.reject()

    return Promise.resolve()
  },
  getIdentity: () => {
    return new Promise((resolve, reject) => {
      const data = localStorage.getItem('auth')
      if (data === null) reject(new Error('Not logged in'))
      const auth = JSON.parse(data)
      resolve({
        username: auth.username,
      })
    })
  },
  getPermissions: () => {
    // Required for the authentication to work
    return Promise.resolve()
  },
}

export default adminAuthProvider
