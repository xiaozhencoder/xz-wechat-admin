import Cookies from "js-cookie"

export function getDataByCache(key) {
  return Cookies.get(key) ? JSON.parse(Cookies.get(key)) : null
}

export function setDataToCache(key, data) {
  if (data) {
    if (getDataByCache(key)) {
      Cookies.remove(key, { domain: "." + (window as any).config.DOMAIN, path: "/" })
      console.log(key, getDataByCache(key), (window as any).config.DOMAIN)
    }
    // document.cookie = key + '=0;path=/;domain=' + window.config.DOMAIN +
    //     ';expires=' + new Date(0).toUTCString()
    Cookies.set(key, JSON.stringify(data))
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function getLocalStorageData(key) {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) || "") : null
}

export function setLocalStorageData(key, data) {
  if (data) {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function removeLocalStorageData(key) {
  return localStorage.removeItem(key)
}

export function copyCookieToLocalStorage() {
  const allCookies = Cookies.get()
  if (allCookies) {
    for (const k in allCookies) {
      localStorage.setItem(k, allCookies[k])
    }
  }
}
