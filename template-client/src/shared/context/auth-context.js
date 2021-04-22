import { createContext } from "react"

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    token: null,
    login: () => { },
    logout: () => { },
    secondaryIsLoggedIn: false,
    secondaryId: null,
    secondaryToken: null,
    secondaryLogin: () => { },
    secondaryLogout: () => { }
})