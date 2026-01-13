import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Check, X, Search, Briefcase, MapPin, Heart, Users } from 'lucide-react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';

const Connect = () => {
    const {
        user,
        loading,
        recommendations,
        connections,
        connectionRequests,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        searchPeers,
        fetchSocialData,
        accessChat
    } = useApp();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeTab, setActiveTab] = useState('recommended');

    const navigate = useNavigate();

    const handleMessageClick = async (userId) => {
        const chat = await accessChat(userId);
        if (chat) {
            navigate('/chat', { state: { chatId: chat._id } }); // Pass chat ID to open
        }
    };

    // Debounced Search Effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim()) {
                setIsSearching(true);
                const results = await searchPeers(searchQuery);
                setSearchResults(results || []);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Fetch data when tab changes or component mounts
    useEffect(() => {
        if (user) {
            fetchSocialData();
        } else if (!loading) {
            navigate('/login');
        }
    }, [activeTab, user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
            </div>
        );
    }

    if (!user) return null; // Should redirect by now

    // Determine which list to show
    const displayList = searchQuery ? searchResults : (
        activeTab === 'recommended' ? recommendations :
            activeTab === 'connected' ? connections :
                connectionRequests
    );

    // Unified Card Component
    const UserCard = ({ peerUser, type, requestId = null }) => {
        // Safe check for peerUser
        if (!peerUser) return null;

        // type: 'recommended', 'connected', 'request'
        const isConnected = type === 'connected';

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative">

                {/* Heart Icon for Recommendations */}
                {type === 'recommended' && (
                    <div className="absolute top-4 right-4 text-red-500 animate-pulse">
                        <Heart size={20} fill="currentColor" />
                    </div>
                )}

                {/* Avatar */}
                <div className="w-20 h-20 mb-4 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md group-hover:scale-105 transition-transform">
                    {peerUser.name?.charAt(0) || '?'}
                </div>

                {/* Name & ID */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{peerUser.name}</h3>
                <p className="text-sm text-gray-500 mb-6 font-mono bg-gray-50 px-2 py-1 rounded">
                    {peerUser.rvceId}
                </p>

                {/* Details Block */}
                <div className="w-full space-y-3 mb-6 flex-grow">
                    <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <Briefcase size={16} className="text-sky-500 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium">{peerUser.department} <span className="text-gray-400">•</span> {peerUser.role}</span>
                    </div>
                    {peerUser.location && (
                        <div className="flex items-center text-gray-600 bg-gray-50 p-2 rounded-lg">
                            <MapPin size={16} className="text-sky-500 mr-3 flex-shrink-0" />
                            <span className="text-sm">{peerUser.location}</span>
                        </div>
                    )}
                </div>

                {/* Private Info Preview (Only for Connected) */}
                {isConnected && peerUser.showPersonalDetails && peerUser.interests && (
                    <div className="w-full mb-6 text-left">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Interests</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                            {peerUser.interests.map(i => (
                                <span key={i} className="text-xs bg-sky-50 text-sky-700 px-2 py-1 rounded-full">
                                    {i}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="w-full mt-auto">
                    {type === 'connected' && (
                        <div className="flex space-x-2">
                            <button disabled className="flex-1 py-2.5 bg-green-50 text-green-700 rounded-lg font-medium flex items-center justify-center space-x-2 cursor-default border border-green-100">
                                <Check size={18} />
                                <span>Connected</span>
                            </button>
                            <button
                                onClick={() => handleMessageClick(peerUser._id)}
                                className="flex-1 py-2.5 bg-sky-50 text-sky-700 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-sky-100 transition-colors border border-sky-100"
                            >
                                <span className="transform rotate-0">💬</span>
                                <span>Message</span>
                            </button>
                        </div>
                    )}

                    {type === 'recommended' && (
                        <button
                            onClick={() => sendConnectionRequest(peerUser._id)}
                            className="btn-primary w-full py-2.5 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg bg-sky-600 text-white hover:bg-sky-700"
                        >
                            <UserPlus size={18} />
                            <span>Connect</span>
                        </button>
                    )}

                    {type === 'request' && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => acceptConnectionRequest(requestId)}
                                className="flex-1 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-1 shadow-md"
                            >
                                <Check size={18} />
                                <span>Accept</span>
                            </button>
                            <button
                                onClick={() => rejectConnectionRequest(requestId)}
                                className="flex-1 py-2.5 bg-white text-red-500 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center space-x-1"
                            >
                                <X size={18} />
                                <span>Reject</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Match Footer */}
                {type === 'recommended' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                            {peerUser.department === user?.department && (
                                <span className="flex items-center"><span className="mr-1">🎓</span> Same Dept</span>
                            )}
                            {peerUser.interests?.some(i => user?.interests?.includes(i)) && (
                                <span className="flex items-center"><span className="mr-1">❤️</span> Common Interests</span>
                            )}
                            {peerUser.location === user?.location && (
                                <span className="flex items-center"><span className="mr-1">📍</span> Near You</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8 animate-fade-in text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect with Peers</h1>
                    <p className="text-gray-600">Discover and connect with students and staff at RVCE</p>
                </div>

                {/* Tabs */}
                <div className="mb-8 flex flex-wrap justify-center md:justify-start gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit mx-auto md:mx-0">
                    <button
                        onClick={() => setActiveTab('recommended')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${activeTab === 'recommended'
                            ? 'bg-sky-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Heart size={18} className={activeTab === 'recommended' ? 'fill-current' : ''} />
                        <span>Connect</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === 'recommended' ? 'bg-white/20' : 'bg-gray-100'}`}>
                            {recommendations.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('connected')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${activeTab === 'connected'
                            ? 'bg-sky-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Users size={18} />
                        <span>Connected</span>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === 'connected' ? 'bg-white/20' : 'bg-gray-100'}`}>
                            {connections.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${activeTab === 'requests'
                            ? 'bg-sky-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <UserPlus size={18} />
                        <span>Requests</span>
                    </button>
                </div>

                {/* Search Bar (Only relevant for Connect/Connected tabs visualization usually, but let's keep global) */}
                <div className="mb-8 relative max-w-lg mx-auto md:mx-0">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-field !pl-12 shadow-sm"
                        placeholder="Search peers by name, department, or interests..."
                    />
                </div>

                {/* Content Grid - Consistent Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                    {/* Rendering Logic: 
                        1. Search Results (Generic User Cards)
                        2. Requests (Has nested sender)
                        3. Standard Lists (Recommendations/Connections)
                    */}
                    {displayList.map((item, index) => {
                        // Handle Requests having nested 'sender' object
                        const isRequestTab = activeTab === 'requests' && !searchQuery;
                        const peerUser = isRequestTab ? item?.sender : item;
                        const requestId = isRequestTab ? item?._id : null;

                        // Determine card type for visuals/actions
                        let cardType = 'recommended'; // Default for search results
                        if (!searchQuery) {
                            if (activeTab === 'connected') cardType = 'connected';
                            if (activeTab === 'requests') cardType = 'request';
                        } else {
                            // In search results, check if already connected
                            const isConnected = connections.some(c => c._id === peerUser._id);
                            if (isConnected) cardType = 'connected';
                        }

                        return (
                            <div key={item._id || index} className="animate-slide-up h-full" style={{ animationDelay: `${index * 50}ms` }}>
                                <UserCard peerUser={peerUser} type={cardType} requestId={requestId} />
                            </div>
                        );
                    })}
                </div>

                {/* Empty States */}
                {displayList.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 dashed">
                        {searchQuery ? (
                            <p className="text-gray-500">No users found matching "{searchQuery}"</p>
                        ) : (
                            <p className="text-gray-500">
                                {activeTab === 'recommended' && "No new recommendations found."}
                                {activeTab === 'connected' && "You haven't connected with anyone yet."}
                                {activeTab === 'requests' && "No pending connection requests."}
                            </p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Connect;
