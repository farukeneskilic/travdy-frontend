# Travdy Next.js Frontend

A modern, scalable travel planning application built with Next.js 15, TypeScript, and clean architecture principles. This frontend is designed to integrate seamlessly with a Java Spring Boot backend.

## 🏗️ Architecture Overview

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── domain/                 # Business Logic Layer
│   ├── entities/           # Core business entities
│   └── repositories/       # Repository interfaces
├── application/            # Application Logic Layer
│   ├── services/           # Business services implementing SOLID principles
│   └── stores/             # Reactive state management (Zustand)
├── infrastructure/         # Infrastructure Layer
│   ├── api/                # API client and HTTP utilities
│   ├── repositories/       # Repository implementations
│   └── di/                 # Dependency injection container
└── app/                    # Presentation Layer (Next.js App Router)
    ├── components/         # Reusable UI components
    ├── pages/              # Application pages
    └── api/                # API routes for backend proxy
```

## 🚀 Features

### ✅ Implemented Features

- **🏛️ Clean Architecture**: Domain-driven design with clear layer separation
- **🔐 JWT Authentication**: Secure authentication with Spring Boot backend integration
- **🗺️ Travel Planning**: Multi-step travel planning with destination, dates, and budget
- **💰 Budget Management**: Advanced budget tracking and recommendations
- **📱 Responsive Design**: Mobile-first approach with modern UI/UX
- **⚡ Reactive State**: Zustand-based state management with persistence
- **🧪 Unit Testing**: Comprehensive test coverage with Jest and Testing Library
- **🔄 Error Handling**: Robust error handling and user feedback
- **🎯 Type Safety**: Full TypeScript implementation
- **🌐 API Integration**: Frontend-only architecture with all data operations via Spring Boot backend

### 🎯 Travel Planning Features

1. **Destination Selection**: Search and select from popular destinations
2. **Date Planning**: Choose travel dates with duration calculation
3. **Budget Planning**: Smart budget recommendations based on destination and duration
4. **Preferences**: Customize accommodation, activities, and accessibility needs
5. **Recommendations**: Get personalized recommendations for:
   - 🎭 **Activities** based on user preferences
   - 🎪 **Events** happening during travel dates
   - 🏛️ **Sightseeing** top-rated attractions

## 🛠️ Technology Stack

### Frontend Technologies
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Zustand** - Lightweight reactive state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **CSS-in-JS (styled-jsx)** - Component-scoped styling

### Testing
- **Jest** - Testing framework
- **Testing Library** - React component testing
- **@testing-library/user-event** - User interaction simulation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundling (Next.js 15)

## 🎯 SOLID Principles Implementation

### 1. **Single Responsibility Principle (SRP)**
- Each service has one clear responsibility
- Components are focused on specific UI concerns
- Clear separation between data access, business logic, and presentation

### 2. **Open/Closed Principle (OCP)**
- Repository pattern allows for easy extension of data sources
- Service interfaces enable new implementations without modifying existing code

### 3. **Liskov Substitution Principle (LSP)**
- All repository implementations are interchangeable
- Service implementations can be swapped without breaking functionality

### 4. **Interface Segregation Principle (ISP)**
- Small, focused interfaces for each service
- Clients depend only on interfaces they use

### 5. **Dependency Inversion Principle (DIP)**
- High-level modules depend on abstractions (interfaces)
- Dependency injection container manages all dependencies

## 🔄 Reactive Patterns

### State Management with Zustand
- **Immutable Updates**: All state changes are immutable
- **Selective Subscriptions**: Components subscribe only to needed state slices
- **Persistence**: Critical state is persisted to localStorage
- **Optimistic Updates**: UI updates immediately with rollback on errors

### Data Flow
1. User actions trigger store actions
2. Store actions call service methods
3. Services interact with repositories
4. Repositories make API calls
5. UI reactively updates based on state changes

## 🔐 Authentication & Security

### JWT Token Management
- **HTTP-Only Cookies**: Tokens stored securely in HTTP-only cookies
- **Automatic Refresh**: Silent token refresh using refresh tokens
- **CSRF Protection**: SameSite cookie settings prevent CSRF attacks
- **Secure Headers**: Proper security headers for production

### Backend Integration
- **Proxy Pattern**: Next.js API routes act as secure proxy to Spring Boot backend
- **Token Forwarding**: Automatic JWT token forwarding to backend services
- **Error Handling**: Consistent error handling across all API calls

## 🧪 Testing Strategy

### Unit Tests
- **Service Layer**: Business logic validation
- **Store Layer**: State management testing
- **Component Layer**: UI component behavior
- **API Layer**: HTTP client and error handling

### Test Coverage
- Minimum 70% coverage requirement
- Focus on critical business logic
- Integration tests for complete user flows

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Java Spring Boot backend (optional for development)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd travdy-next

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following configuration:

```env
# Spring Boot Backend URL (where your database operations are handled)
SPRING_BACKEND_URL=http://localhost:8080

# Next.js Public API Base (for client-side requests to proxy routes)
NEXT_PUBLIC_API_BASE=http://localhost:3000/api

# Application Environment
NODE_ENV=development

# Note: No database configuration needed here - all database operations
# are handled by the Spring Boot backend
```

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## 🏗️ Project Structure Deep Dive

### Domain Layer (`src/domain/`)
Contains pure business logic with no dependencies on external frameworks:

- **Entities**: Core business objects (User, TravelPlan, Activity, etc.)
- **Repository Interfaces**: Contracts for data access
- **Value Objects**: Immutable objects representing business concepts

### Application Layer (`src/application/`)
Orchestrates business logic and manages application state:

- **Services**: Implement business use cases
- **Stores**: Reactive state management with Zustand
- **DTOs**: Data transfer objects for API communication

### Infrastructure Layer (`src/infrastructure/`)
Handles external concerns and technical implementations:

- **API Client**: HTTP communication with Spring Boot backend
- **Repository Implementations**: API-based data access (no direct database connections)
- **Dependency Injection**: IoC container for managing dependencies

### Presentation Layer (`src/app/`)
Next.js App Router structure with UI components:

- **Pages**: Route-based page components
- **Components**: Reusable UI components
- **API Routes**: Backend proxy endpoints

## 🔌 Spring Boot Integration

This frontend is designed to work seamlessly with a Spring Boot backend:

### Data Flow
1. **Frontend Components** → Make API calls using the API client
2. **Next.js API Routes** (`/src/app/api/*`) → Proxy requests to Spring Boot
3. **Spring Boot Backend** → Handles all database operations and business logic
4. **Database** → Managed entirely by Spring Boot (PostgreSQL, MySQL, etc.)

### Key Benefits
- **No Database Dependencies**: Frontend has zero database configuration
- **Stateless Frontend**: All data persistence handled by Spring Boot
- **Security**: JWT tokens managed by Spring Boot with secure HTTP-only cookies
- **Scalability**: Frontend and backend can be deployed independently

### Authentication Flow
1. User submits login credentials to Next.js `/api/auth/login`
2. Next.js proxies request to Spring Boot `/api/auth/login`
3. Spring Boot validates credentials against database
4. Spring Boot returns JWT token and user data
5. Next.js sets secure HTTP-only cookies and returns user data

### API Client Configuration
All repository implementations use the `ApiClient` class that:
- Automatically includes JWT tokens in requests
- Handles token refresh logic
- Provides consistent error handling
- Routes all requests to Spring Boot endpoints

## 🎨 Design System

### CSS Architecture
- **Component-Scoped Styles**: Using styled-jsx for isolation
- **Design Tokens**: CSS custom properties for consistency
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: WCAG 2.1 AA compliance

### UI Components
- **Form Components**: Consistent form styling and validation
- **Navigation**: Responsive navigation with active states
- **Feedback**: Loading states, error messages, and success indicators
- **Cards**: Reusable card components for content display

## 🔮 Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration for live updates
- **Offline Support**: PWA capabilities with service workers
- **Advanced Filtering**: Complex search and filtering options
- **Social Features**: User reviews and recommendations
- **Payment Integration**: Booking and payment processing
- **Maps Integration**: Interactive maps for destinations and activities

### Performance Optimizations
- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Route-based and component-based code splitting
- **Caching**: Strategic caching for API responses and static assets
- **Preloading**: Smart preloading of critical resources

## 🤝 Contributing

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow established linting rules
- **Testing**: Write tests for new features
- **Documentation**: Update README and code comments

### Pull Request Process
1. Create feature branch from `main`
2. Implement feature with tests
3. Update documentation
4. Submit pull request with clear description

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions and support:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for modern travel planning**