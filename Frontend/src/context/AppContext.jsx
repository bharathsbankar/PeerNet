import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const ENDPOINT = "http://127.0.0.1:5000"; // Or localhost:5000
var socket;

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const [connectionRequests, setConnectionRequests] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [connections, setConnections] = useState([]);

    // Socket Initialization on Auth
    useEffect(() => {
        if (user) {
            socket = io(ENDPOINT);
            socket.emit("setup", user);
            socket.on("connected", () => console.log("Socket Connected"));

            // Global Message Listener
            socket.on("message received", (newMessageRecieved) => {
                // If message is for a chat we have locally, update it
                setChats(prevChats => {
                    const chatExists = prevChats.find(c => c._id === newMessageRecieved.chat); // Assuming msg has chat ID

                    // Since the backend 'new message' payload might be the full chat or message object
                    // In server.js we broadcast 'newMessageRecieved'. 
                    // Let's assume it's the updated CHAT object or we should fetch fresh.
                    // Actually, getting the full updated chat is safest to sync state.

                    // For now, let's trigger a re-fetch or optimistically update if we know format.
                    // Simplest: Re-fetch chats to ensure full sync.
                    fetchChats();
                    return prevChats;
                });
            });
        }
    }, [user]);
    // Check for logged in user on boot
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await fetch('/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    setIsAuthenticated(true);
                    // Fetch initial data
                    fetchSocialData();
                } else {
                    // Token invalid/expired
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    // Check for logged in user on boot
    useEffect(() => {
        checkAuth();
    }, []);

    const fetchSocialData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            const [recRes, connRes, reqRes] = await Promise.all([
                fetch('/api/users/recommendations', { headers }),
                fetch('/api/users/connections', { headers }),
                fetch('/api/users/requests', { headers })
            ]);

            if (recRes.ok) setRecommendations(await recRes.json());
            if (connRes.ok) setConnections(await connRes.json());
            if (reqRes.ok) setConnectionRequests(await reqRes.json());

            // Fetch Chats too
            fetchChats();

        } catch (error) {
            console.error("Error fetching social data:", error);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Success
            localStorage.setItem('token', data.token);
            // Verify and get full profile data immediately
            await checkAuth();
            // setUser(data); // Replaced by checkAuth which fetches full me
            // setIsAuthenticated(true); // checkAuth handles this
            fetchSocialData(); // Fetch social data after login
            return { success: true };

        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Success
            localStorage.setItem('token', data.token);
            await checkAuth(); // Fetch full profile
            // setUser(data);
            // setIsAuthenticated(true);
            fetchSocialData(); // Fetch data after register
            return { success: true };

        } catch (error) {
            console.error("Register error:", error);
            return { success: false, message: error.message };
        }
    };

    const updateProfile = async (profileData) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Update failed');
            }

            // Success
            setUser(data); // Update local user state
            return { success: true };

        } catch (error) {
            console.error("Update profile error:", error);
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        setChats([]);
        setConnectionRequests([]);
        setRecommendations([]);
        setConnections([]);
    };

    const sendConnectionRequest = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/users/request/${userId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                // Update local state optimistically or re-fetch
                fetchSocialData();
                return { success: true };
            }
        } catch (error) {
            console.error("Send request error:", error);
        }
        return { success: false };
    };

    const acceptConnectionRequest = async (requestId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/users/request/${requestId}/accept`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchSocialData();
                return { success: true };
            }
        } catch (error) {
            console.error("Accept request error:", error);
        }
        return { success: false };
    };

    const rejectConnectionRequest = async (requestId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/users/request/${requestId}/reject`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchSocialData();
                return { success: true };
            }
        } catch (error) {
            console.error("Reject request error:", error);
        }
        return { success: false };
    };

    const searchPeers = async (query) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/users/search/${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                return await res.json();
            }
        } catch (error) {
            console.error("Search error:", error);
        }
        return [];
    };

    // --- FEED LOGIC (Added) ---
    const [feeds, setFeeds] = useState([]);

    const fetchFeeds = async () => {
        try {
            const res = await fetch('/api/feed');
            if (res.ok) {
                const data = await res.json();
                setFeeds(data);
            }
        } catch (error) {
            console.error("Error fetching feeds:", error);
        }
    };

    const createFeed = async (feedData) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/feed', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(feedData)
            });
            if (res.ok) {
                await fetchFeeds(); // Refresh list
                return { success: true };
            } else {
                const data = await res.json();
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error creating feed:", error);
            return { success: false, message: "Network error" };
        }
    };

    const fetchChats = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/chat', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setChats(data);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    const accessChat = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId })
            });
            if (res.ok) {
                const chat = await res.json();
                // If chat not in list, add it
                if (!chats.find(c => c._id === chat._id)) {
                    setChats([chat, ...chats]);
                }
                return chat;
            }
        } catch (error) {
            console.error("Error accessing chat:", error);
        }
        return null;
    };

    const sendMessage = async (chatId, content) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ chatId, content })
            });
            if (res.ok) {
                const data = await res.json();

                // Socket Emit
                socket.emit("new message", data);

                // Update local chats state with new message
                const updatedChats = chats.map(c =>
                    c._id === chatId ? { ...data, otherUser: c.otherUser } : c
                );
                // Move updated chat to top
                updatedChats.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
                setChats(updatedChats);
                return true;
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
        return false;
    };

    const value = {
        user,
        setUser,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
        updateProfile,
        chats,
        sendMessage,
        recommendations,
        connections,
        connectionRequests,
        fetchSocialData,
        feeds,
        fetchFeeds,
        createFeed,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        accessChat,
        searchPeers
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
