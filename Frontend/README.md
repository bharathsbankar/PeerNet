# RVCE Connect - README

## 🎓 About RVCE Connect

RVCE Connect is a college-specific social networking platform designed for RV College of Engineering. It enables students and staff to:
- **Connect** with peers based on interests, department, and location
- **Discover** college events through a centralized feed
- **Chat** with connected peers in real-time
- **Network** while respecting privacy preferences

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Navigate to Frontend directory
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at: **http://localhost:5173**

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── Header.jsx       # Navigation header
│   ├── context/             # State management
│   │   └── AppContext.jsx   # Global app state
│   ├── data/                # Dummy data
│   │   └── dummyData.js     # Mock data for testing
│   ├── pages/               # Page components
│   │   ├── Login.jsx        # Landing/Login page
│   │   ├── Register.jsx     # Registration with validation
│   │   ├── Home.jsx         # Event feed
│   │   ├── Connect.jsx      # Peer discovery
│   │   ├── Chat.jsx         # Messaging interface
│   │   └── Profile.jsx      # User profile
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles (TailwindCSS)
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## 🎨 Features

### 1. Authentication
- **Login**: Email/password authentication
- **Register**: RVCE ID validation (Format: `RVCE**@@@***`)
- Department selection dropdown
- Interest tag selection
- Privacy settings

### 2. Event Feed
- Beautiful card-based layout
- Event posters with images
- Date, time, and location information
- Direct registration links
- Responsive grid (1/2/3 columns)

### 3. Peer Connection
- **Smart Recommendations**: Based on interests, department, location
- **Privacy-Aware**: Respects user privacy settings
- **Three Tabs**: Recommended, All Users, Connection Requests
- Search functionality
- Accept/reject connection requests

### 4. Real-time Chat
- Conversation list with search
- Message history
- Send/receive messages
- Timestamp display
- Ready for Socket.io integration

### 5. User Profile
- View/Edit mode toggle
- Update interests, bio, location
- Privacy settings control
- Connection statistics

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Library |
| Vite | 7.3.0 | Build Tool |
| TailwindCSS | 3.4.17 | Styling |
| React Router | 7.1.3 | Routing |
| Lucide React | 0.469.0 | Icons |
| Framer Motion | 11.15.0 | Animations |

## 🎯 Key Design Decisions

### Privacy-First Approach
- Users control visibility of personal details
- Unconnected users see limited information
- Connected users see full details only if allowed

### Smart Recommendations
- Algorithm considers:
  - Common interests
  - Same department
  - Same location
- Visual indicators show match reasons

### RVCE ID Validation
- Format: `RVCE` + Year(2) + Department(3) + Number(3)
- Example: `RVCE23CSE042`
- Real-time validation feedback

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg)
- Adaptive layouts for all screen sizes

## 📊 Dummy Data

The application includes comprehensive dummy data for testing:
- **Current User**: Rajesh Kumar (CSE Student)
- **6 Peer Users**: Mix of students and staff
- **4 Events**: TechFest, Cultural Night, Hackathon, Sports Day
- **3 Chat Conversations**: With message history
- **2 Connection Requests**: Pending requests

## 🔐 Privacy Settings

Users can control:
- **Show Personal Details**: Toggle to show/hide interests and bio to connected peers
- Unconnected users always see: Name, Department, Role only
- Connected users see full profile only if allowed

## 🎨 Design System

### Colors
- **Primary**: Blue (#0ea5e9)
- **Background**: Gray-50 (#f9fafb)
- **Cards**: White with shadows
- **Text**: Gray-900 (dark), Gray-600 (medium), Gray-500 (light)

### Typography
- **Font**: System fonts (sans-serif)
- **Headings**: Bold, larger sizes
- **Body**: Regular weight, readable sizes

### Components
- **Buttons**: Primary (blue), Secondary (outlined)
- **Cards**: White background, rounded corners, hover shadows
- **Inputs**: Border with focus ring
- **Badges**: Rounded pills for tags

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 639px) {
  - Single column layout
  - Icon-only navigation
  - Stacked cards
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  - Two column layout
  - Full navigation labels
  - Grid cards
}

/* Desktop */
@media (min-width: 1024px) {
  - Three column layout
  - Full navigation
  - Optimal spacing
}
```

## 🔄 State Management

### App Context
Global state managed via React Context API:
- User authentication state
- Current user data
- Chat conversations
- Connection requests

### Local State
Component-specific state using `useState`:
- Form inputs
- UI toggles
- Search queries

## 🚧 Backend Integration (TODO)

When backend is ready, replace:

1. **Authentication**
   ```javascript
   // Replace in AppContext.jsx
   const login = async (email, password) => {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       body: JSON.stringify({ email, password })
     });
     // Handle JWT token
   };
   ```

2. **Data Fetching**
   ```javascript
   // Replace dummy data imports with API calls
   const fetchFeeds = async () => {
     const response = await fetch('/api/feeds');
     return response.json();
   };
   ```

3. **Real-time Chat**
   ```javascript
   // Add Socket.io
   import io from 'socket.io-client';
   const socket = io('http://localhost:3000');
   ```

## 📝 Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## 🧪 Testing

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing instructions.

### Quick Test
1. Visit http://localhost:5173
2. Login with any credentials
3. Explore all pages
4. Test interactions

## 🐛 Known Limitations

- **Dummy Data**: All data is static (no persistence)
- **Authentication**: No real JWT validation
- **Chat**: Messages don't persist (no Socket.io yet)
- **Images**: Event images from Unsplash (require internet)
- **Recommendations**: Simple algorithm (can be improved)

## 🎯 Future Enhancements

### Phase 1 (Backend Integration)
- [ ] Real authentication with JWT
- [ ] Database integration (MongoDB)
- [ ] API endpoints for all features
- [ ] Socket.io for real-time chat

### Phase 2 (Features)
- [ ] Image upload for events and profiles
- [ ] Notifications system
- [ ] Advanced search and filters
- [ ] Event RSVP tracking
- [ ] Admin dashboard

### Phase 3 (Polish)
- [ ] Loading states and skeletons
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Infinite scroll
- [ ] Progressive Web App (PWA)

## 👥 User Roles

1. **Student/Staff**: Regular users
   - View events
   - Connect with peers
   - Chat with connections
   - Manage profile

2. **Event Poster**: Can create events
   - All student/staff features
   - Create/edit/delete own events

3. **Admin**: Full control
   - All features
   - Manage users
   - Manage all events
   - Assign event poster role

## 📄 License

This project is created for educational purposes as part of Design Thinking course at RVCE.

## 🤝 Contributing

This is a college project. For suggestions or improvements, please contact the development team.

## 📞 Support

For issues or questions:
- Check [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- Review [walkthrough.md](../walkthrough.md)
- Contact: [Your contact information]

---

**Built with ❤️ for RVCE Community**
