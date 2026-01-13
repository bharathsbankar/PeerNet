import { useState, useRef } from 'react';
import { X, Upload, Calendar, MapPin, Link as LinkIcon, Image as ImageIcon, Loader } from 'lucide-react';

const CreateFeedModal = ({ onClose, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        link: '',
        image: ''
    });
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result }); // Base64 string
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Create New Event</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Image Upload */}
                        <div className="relative group">
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className={`w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${preview ? 'border-sky-500 bg-sky-50' : 'border-gray-300 hover:border-sky-400 hover:bg-gray-50'}`}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-2">
                                            <Upload size={24} className="text-sky-500" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">Click to upload event banner</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Annual Tech Symposium 2024"
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Date & Location Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="datetime-local"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="input-field !pl-10"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. IEM Auditorium"
                                        className="input-field !pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Registration Link */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Link</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    placeholder="https://forms.google.com/..."
                                    className="input-field !pl-10"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Tell us about the event..."
                                className="input-field resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary px-6 py-2.5 shadow-lg flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={18} />
                                        <span>Posting...</span>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon size={18} />
                                        <span>Create Post</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateFeedModal;
