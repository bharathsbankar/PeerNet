import { useState } from 'react';
import { Mail, MapPin, Briefcase, Edit2, Save, X } from 'lucide-react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import { departments, interests as interestOptions } from '../data/dummyData';

const Profile = () => {
    const { user, setUser } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);

    const handleSave = () => {
        setUser(formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData(user);
        setIsEditing(false);
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
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="card p-8 animate-fade-in">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-600">{user.rvceId}</p>
                            </div>
                        </div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <Edit2 size={18} />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSave}
                                    className="btn-primary flex items-center space-x-2"
                                >
                                    <Save size={18} />
                                    <span>Save</span>
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="btn-secondary flex items-center space-x-2"
                                >
                                    <X size={18} />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="flex items-center space-x-2 text-gray-900">
                                <Mail size={18} className="text-primary-600" />
                                <span>{user.email}</span>
                            </div>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Department
                            </label>
                            {isEditing ? (
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="input-field"
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex items-center space-x-2 text-gray-900">
                                    <Briefcase size={18} className="text-primary-600" />
                                    <span>{user.department}</span>
                                    <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                        {user.role}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="input-field"
                                    placeholder="Enter your location"
                                />
                            ) : (
                                <div className="flex items-center space-x-2 text-gray-900">
                                    <MapPin size={18} className="text-primary-600" />
                                    <span>{user.location || 'Not specified'}</span>
                                </div>
                            )}
                        </div>

                        {/* Interests */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interests
                            </label>
                            {isEditing ? (
                                <div className="flex flex-wrap gap-2">
                                    {interestOptions.map(interest => (
                                        <button
                                            key={interest}
                                            type="button"
                                            onClick={() => toggleInterest(interest)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${formData.interests.includes(interest)
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.map(interest => (
                                        <span
                                            key={interest}
                                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                    {user.interests.length === 0 && (
                                        <span className="text-gray-500">No interests added</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            {isEditing ? (
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="input-field resize-none"
                                    rows="4"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-gray-900 whitespace-pre-wrap">
                                    {user.bio || 'No bio added yet'}
                                </p>
                            )}
                        </div>

                        {/* Privacy Settings */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Show Personal Details</p>
                                    <p className="text-sm text-gray-600">
                                        Allow connected peers to see your interests and bio
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isEditing ? formData.showPersonalDetails : user.showPersonalDetails}
                                        onChange={(e) => isEditing && setFormData({ ...formData, showPersonalDetails: e.target.checked })}
                                        disabled={!isEditing}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Connections</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-primary-50 rounded-lg">
                                    <p className="text-3xl font-bold text-primary-600">{user.connectedPeers.length}</p>
                                    <p className="text-sm text-gray-600">Connected</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-3xl font-bold text-gray-600">0</p>
                                    <p className="text-sm text-gray-600">Pending</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg">
                                    <p className="text-3xl font-bold text-gray-600">12</p>
                                    <p className="text-sm text-gray-600">Profile Views</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
