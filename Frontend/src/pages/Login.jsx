import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Users, Calendar, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useApp();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData.email, formData.password);
        navigate('/home');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <div className="text-center md:text-left space-y-6 animate-fade-in">
                    <div className="flex items-center justify-center md:justify-start space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-3xl">RC</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">RVCE Connect</h1>
                    </div>

                    <p className="text-xl text-gray-600">
                        Connect with peers, discover events, and build your college network
                    </p>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-center space-x-3 text-gray-700">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Users className="text-primary-600" size={20} />
                            </div>
                            <span className="font-medium">Connect with students & staff</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Calendar className="text-primary-600" size={20} />
                            </div>
                            <span className="font-medium">Stay updated with college events</span>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-700">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                <MessageCircle className="text-primary-600" size={20} />
                            </div>
                            <span className="font-medium">Chat with your connections</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="card p-8 animate-slide-up">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back!</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field !pl-12"
                                    placeholder="your.email@rvce.edu.in"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field !pl-12"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full">
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                                Register here
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            For demo: Use any email and password to login
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
