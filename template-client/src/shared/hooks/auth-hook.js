import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        setUserId(uid);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid,
                token: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (
            storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login]);

    // 

    const [secondaryToken, setSecondaryToken] = useState(false);
    const [secondaryTokenExpirationDate, setSecondaryTokenExpirationDate] = useState();
    const [secondaryId, setSecondaryId] = useState(false);

    const secondaryLogin = useCallback((uid, token, expirationDate) => {
        setSecondaryToken(token);
        setSecondaryId(uid);
        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setSecondaryTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            'companyData',
            JSON.stringify({
                secondaryId: uid,
                secondaryToken: token,
                expiration: tokenExpirationDate.toISOString()
            })
        );
    }, []);

    const secondaryLogout = useCallback(() => {
        setSecondaryToken(null);
        setSecondaryTokenExpirationDate(null);
        setSecondaryId(null);
        localStorage.removeItem('companyData');
    }, []);

    useEffect(() => {
        if (secondaryToken && secondaryTokenExpirationDate) {
            const remainingTime = secondaryTokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(secondaryLogout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [secondaryToken, secondaryLogout, secondaryTokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('companyData'));
        if (
            storedData &&
            storedData.secondaryToken &&
            new Date(storedData.expiration) > new Date()
        ) {
            secondaryLogin(storedData.secondaryId, storedData.secondaryToken, new Date(storedData.expiration));
        }
    }, [secondaryLogin]);

    return { token, login, logout, userId, secondaryToken, secondaryLogin, secondaryLogout, secondaryId };
};