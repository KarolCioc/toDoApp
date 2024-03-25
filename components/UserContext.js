import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from "../firebase";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState();
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [initializing, setInitializing] = useState(true);

    function onAuthStateChanged(user) {
        setUserInfo(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    const handleLocationSelect = (latitude, longitude, name) => {
        setSelectedLocation({ latitude, longitude, name });
    };

    if (initializing) return null;

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, selectedLocation, handleLocationSelect, setSelectedLocation }}>
            {children}
        </UserContext.Provider>
    );
};
