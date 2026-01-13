import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, MapPin, IdCard, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { departments, interests as interestOptions } from '../data/constants';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        rvceId: '',
        department: '',
        interests: [],
        bio: '',
        location: '',
        showPersonalDetails: false
    });
    const [rvceIdError, setRvceIdError] = useState('');

    const validateRvceId = (id) => {
        // Format: RVCE**@@@*** where * is number, @ is alphabet
        const regex = /^RVCE\d{2}[A-Z]{3}\d{3}$/;
        return regex.test(id);
    };

    const handleRvceIdChange = (e) => {
        const value = e.target.value.toUpperCase();
        setFormData({ ...formData, rvceId: value });

        if (value && !validateRvceId(value)) {
            setRvceIdError('Format: RVCE**@@@*** (e.g., RVCE23CSE042)');
        } else {
            setRvceIdError('');
        }
    };

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateRvceId(formData.rvceId)) {
            setRvceIdError('Invalid RVCE ID format');
            return;
        }

        const res = await register(formData);
        if (res.success) {
            navigate('/home');
        } else {
            setError(res.message);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const toggleInterest = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-2xl">RC</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">RVCE Connect</h1>
                    </div>
                    <p className="text-gray-600">Create your account to get started</p>
                </div>

                <div className="card p-8 animate-slide-up">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field !pl-12"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        {/* RVCE ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                RVCE ID *
                            </label>
                            <div className="relative">
                                <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="rvceId"
                                    value={formData.rvceId}
                                    onChange={handleRvceIdChange}
                                    className={`input-field !pl-12 ${rvceIdError ? 'border-red-500' : ''}`}
                                    placeholder="RVCE23CSE042"
                                    required
                                />
                            </div>
                            {rvceIdError && (
                                <p className="mt-1 text-sm text-red-600">{rvceIdError}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the Valid RVCE ID
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
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

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="input-field !pl-12"
                                    placeholder="Create a strong password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Department *
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="input-field !pl-12"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="input-field !pl-12"
                                    placeholder="e.g., Bangalore, Mysore"
                                />
                            </div>
                        </div>

                        {/* Interests */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interests
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {interestOptions.map(interest => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.interests.includes(interest)
                                            ? 'bg-sky-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                className="input-field resize-none"
                                rows="3"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        {/* Privacy Toggle */}
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="checkbox"
                                id="showPersonalDetails"
                                checked={formData.showPersonalDetails}
                                onChange={(e) => setFormData({ ...formData, showPersonalDetails: e.target.checked })}
                                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
                            />
                            <label htmlFor="showPersonalDetails" className="text-sm text-gray-700">
                                Show my interests and bio to connected peers
                            </label>
                        </div>

                        <button type="submit" className="btn-primary w-full">
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
