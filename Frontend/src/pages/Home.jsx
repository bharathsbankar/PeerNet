import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink, Clock, X, Info, Plus } from 'lucide-react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import CreateFeedModal from '../components/CreateFeedModal';

const Home = () => {
    const { feeds, fetchFeeds, createFeed, user } = useApp();
    const [selectedFeed, setSelectedFeed] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    // Fetch feeds on mount
    useEffect(() => {
        fetchFeeds();
    }, []);

    const handleCreatePost = async (formData) => {
        setIsPosting(true);
        const result = await createFeed(formData);
        setIsPosting(false);
        if (result.success) {
            setIsCreateModalOpen(false);
        } else {
            alert(result.message || "Failed to create post");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Prevent background scrolling when modal is open
    if (selectedFeed || isCreateModalOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header with Action */}
                <div className="mb-8 animate-fade-in flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Feed</h1>
                        <p className="text-gray-600">Stay updated with all the exciting events happening at RVCE</p>
                    </div>

                    {/* Only show for staff/event_poster or for debugging purposes, let's allow all for now */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn-primary flex items-center space-x-2 px-5 py-2.5 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        <span>Create Post</span>
                    </button>
                </div>

                {/* Feed Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {feeds.map((feed, index) => (
                        <div
                            key={feed._id}
                            onClick={() => setSelectedFeed(feed)}
                            className="card group animate-slide-up cursor-pointer hover:-translate-y-1 transition-transform duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Event Image - Compact Banner View */}
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                <img
                                    src={feed.image}
                                    alt={feed.title}
                                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />

                                {/* Overlay Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <p className="text-white font-medium text-sm mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        Click to view details
                                    </p>
                                </div>
                            </div>

                            {/* Minimal Card Details */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-sky-600 transition-colors">
                                        {feed.title}
                                    </h3>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-3">
                                    <div className="flex items-center space-x-1">
                                        <Calendar size={14} />
                                        <span>{formatDate(feed.date)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <MapPin size={14} />
                                        <span className="line-clamp-1 max-w-[100px]">{feed.location}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {feed.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {feeds.length === 0 && (
                    <div className="text-center py-16">
                        <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No events yet</h3>
                        <p className="text-gray-500">Check back later for upcoming events!</p>
                    </div>
                )}
            </main>

            {/* Detailed Event Modal */}
            {selectedFeed && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
                        onClick={() => setSelectedFeed(null)}
                    />

                    {/* Modal Container */}
                    <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row max-h-[90vh]">

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedFeed(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                        >
                            <X size={24} />
                        </button>

                        {/* Left Side: Full Poster Image */}
                        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-0 md:h-auto h-64 relative">
                            <img
                                src={selectedFeed.image}
                                alt={selectedFeed.title}
                                className="w-full h-full object-contain max-h-[85vh] bg-black"
                            />
                        </div>

                        {/* Right Side: Details */}
                        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto bg-white">
                            <div className="flex items-center space-x-2 text-sky-600 text-sm font-semibold tracking-wide uppercase mb-3">
                                <Info size={16} />
                                <span>Event Details</span>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                {selectedFeed.title}
                            </h2>

                            {/* Meta Data Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Date</p>
                                    <div className="flex items-center space-x-2 text-gray-900 font-medium">
                                        <Calendar size={18} className="text-sky-500" />
                                        <span>{formatDate(selectedFeed.date)}</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Time</p>
                                    <div className="flex items-center space-x-2 text-gray-900 font-medium">
                                        <Clock size={18} className="text-sky-500" />
                                        <span>{formatTime(selectedFeed.date)}</span>
                                    </div>
                                </div>
                                <div className="col-span-2 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Location</p>
                                    <div className="flex items-center space-x-2 text-gray-900 font-medium">
                                        <MapPin size={18} className="text-sky-500" />
                                        <span>{selectedFeed.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-blue max-w-none text-gray-600 mb-8 flex-grow">
                                <p className="whitespace-pre-line leading-relaxed">
                                    {selectedFeed.description}
                                </p>
                            </div>

                            {/* Footer Actions */}
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-700 font-bold">
                                            {selectedFeed.postedBy?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Posted by</p>
                                            <p className="text-xs text-gray-500">{selectedFeed.postedBy?.name || 'Unknown User'}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Created {formatDate(selectedFeed.createdAt)}
                                    </p>
                                </div>

                                <a
                                    href={selectedFeed.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full flex items-center justify-center space-x-2 py-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                                >
                                    <span>Register for Event</span>
                                    <ExternalLink size={20} />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            {/* Create Post Modal */}
            {isCreateModalOpen && (
                <CreateFeedModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreatePost}
                    loading={isPosting}
                />
            )}
        </div>
    );
};

export default Home;
