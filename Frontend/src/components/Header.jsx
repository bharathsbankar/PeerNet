import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, MessageCircle, User, LogOut, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useApp();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/home', icon: Home, label: 'Feed' },
        { path: '/connect', icon: Users, label: 'Connect' },
        { path: '/chat', icon: MessageCircle, label: 'Chat' },
        { path: '/profile', icon: User, label: 'Profile' },
    ];

    if (!isAuthenticated) return null;

    return (
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/home" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">RC</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">
                            RVCE Connect
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-1">
                        {navItems.map(({ path, icon: Icon, label }) => (
                            <Link
                                key={path}
                                to={path}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${location.pathname === path
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="hidden md:block font-medium">{label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.rvceId}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
