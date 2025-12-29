import { createContext, useContext, useState } from 'react';
import { currentUser as initialUser, dummyChats, dummyConnectionRequests } from '../data/dummyData';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(initialUser);
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for demo
    const [chats, setChats] = useState(dummyChats);
    const [connectionRequests, setConnectionRequests] = useState(dummyConnectionRequests);

    const login = (email, password) => {
        // Dummy login - always succeeds
        setIsAuthenticated(true);
        setUser(initialUser);
        return true;
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const register = (userData) => {
        // Dummy register - always succeeds
        setUser({ ...initialUser, ...userData });
        setIsAuthenticated(true);
        return true;
    };

    const sendMessage = (chatId, content) => {
        setChats(prevChats =>
            prevChats.map(chat =>
                chat._id === chatId
                    ? {
                        ...chat,
                        messages: [
                            ...chat.messages,
                            {
                                sender: user._id,
                                content,
                                timestamp: new Date()
                            }
                        ]
                    }
                    : chat
            )
        );
    };

    const acceptConnectionRequest = (requestId) => {
        setConnectionRequests(prev =>
            prev.filter(req => req._id !== requestId)
        );
        // In real app, would add to connectedPeers
    };

    const rejectConnectionRequest = (requestId) => {
        setConnectionRequests(prev =>
            prev.filter(req => req._id !== requestId)
        );
    };

    const value = {
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
        register,
        chats,
        sendMessage,
        connectionRequests,
        acceptConnectionRequest,
        rejectConnectionRequest
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
