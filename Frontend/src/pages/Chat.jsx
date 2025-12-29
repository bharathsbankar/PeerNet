import { useState, useRef, useEffect } from 'react';
import { Send, Search } from 'lucide-react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';

const Chat = () => {
    const { user, chats, sendMessage } = useApp();
    const [selectedChat, setSelectedChat] = useState(chats[0]?._id || null);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef(null);

    const currentChat = chats.find(c => c._id === selectedChat);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && selectedChat) {
            sendMessage(selectedChat, message);
            setMessage('');
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                    <div className="flex h-full">
                        {/* Chat List Sidebar */}
                        <div className="w-80 border-r border-gray-200 flex flex-col">
                            {/* Search */}
                            <div className="p-4 border-b border-gray-200">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                        placeholder="Search conversations..."
                                    />
                                </div>
                            </div>

                            {/* Chat List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredChats.map((chat) => {
                                    const lastMessage = chat.messages[chat.messages.length - 1];
                                    return (
                                        <button
                                            key={chat._id}
                                            onClick={() => setSelectedChat(chat._id)}
                                            className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-all ${selectedChat === chat._id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                                                }`}
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {chat.otherUser.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <div className="flex items-baseline justify-between mb-1">
                                                    <h3 className="font-semibold text-gray-900 truncate">{chat.otherUser.name}</h3>
                                                    <span className="text-xs text-gray-500 ml-2">{formatTime(lastMessage.timestamp)}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{lastMessage.content}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chat Window */}
                        {currentChat ? (
                            <div className="flex-1 flex flex-col">
                                {/* Chat Header */}
                                <div className="p-4 border-b border-gray-200 bg-white">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                                            {currentChat.otherUser.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-gray-900">{currentChat.otherUser.name}</h2>
                                            <p className="text-sm text-gray-500">{currentChat.otherUser.department}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                    {currentChat.messages.map((msg, index) => {
                                        const isOwn = msg.sender === user._id;
                                        return (
                                            <div
                                                key={index}
                                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm ${isOwn
                                                        ? 'chat-bubble-sent rounded-br-none'
                                                        : 'bg-white text-gray-900 rounded-bl-none'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.content}</p>
                                                    <p className={`text-xs mt-1 ${isOwn ? 'text-sky-100' : 'text-gray-500'}`}>
                                                        {formatTime(msg.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            placeholder="Type a message..."
                                        />
                                        <button
                                            type="submit"
                                            disabled={!message.trim()}
                                            className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center bg-gray-50">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h3>
                                    <p className="text-gray-500">Choose a chat from the list to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Chat;
