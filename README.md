# Special Needs School Progress Tracker

A comprehensive web application for tracking student progress in special needs education environments. Built with React, TypeScript, and modern web technologies.

## Features

### User Roles & Permissions
- **Admin/Manager**: Complete system access, user management, form creation
- **Teachers**: Student management, assessment completion, progress viewing
- **Therapists**: Similar to teachers with specialized assessment tools

### Core Functionality
- **Dynamic Assessment Forms**: Create and customize assessment forms for different needs
- **Student Progress Tracking**: Visual charts and reports showing student development
- **User Management**: Role-based access control and student assignments
- **Comprehensive Reporting**: Analytics and insights with exportable reports
- **Responsive Design**: Works seamlessly on desktop and tablet devices

### Technical Features
- JWT-based authentication
- Role-based access control
- Interactive charts and visualizations
- Modern, accessible UI design
- Responsive layout for all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + React Chart.js 2
- **Icons**: Lucide React
- **Routing**: React Router Dom
- **Forms**: React Hook Form

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd special-needs-school-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Accounts

The application includes demo accounts for testing:

- **Admin**: `admin@school.com` / `admin123`
- **Teacher**: `teacher@school.com` / `teacher123`
- **Therapist**: `therapist@school.com` / `therapist123`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── pages/              # Main application pages
├── services/           # API and business logic
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Components

### Authentication
- JWT-based authentication system
- Role-based access control
- Protected routes and components

### Dashboard
- Role-specific dashboards
- Quick stats and insights
- Recent activity tracking

### Student Management
- Student profiles and progress tracking
- Assessment history
- Visual progress charts

### Assessment System
- Dynamic form creation
- Assessment completion tracking
- Progress visualization

### Reporting
- Comprehensive analytics
- Exportable reports
- Visual charts and graphs

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style
- ESLint configuration for consistent code style
- TypeScript for type safety
- Prettier for code formatting

## Future Enhancements

### Planned Features
- Real backend integration with Node.js + Express
- MongoDB database integration
- Docker containerization
- Email notifications
- Google OAuth integration
- Mobile app (React Native)

### Backend Architecture (Planned)
```
backend/
├── auth-service/       # Authentication microservice
├── user-service/       # User management
├── student-service/    # Student and assessment data
├── report-service/     # Analytics and reporting
└── notification-service/ # Email/SMS notifications
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.