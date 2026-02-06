export const setCookie = (name, value, days = 365) => {
  const d = new Date()
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = `expires=${d.toUTCString()}`
  const sameSite = 'SameSite=Lax'
  const secure = window.location.protocol === 'https:' ? 'Secure' : ''
  document.cookie = `${name}=${value};${expires};path=/;${sameSite};${secure}`
}

export const getCookie = (name) => {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}