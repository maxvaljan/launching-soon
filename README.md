# MaxMove Monorepo

MaxMove is a logistics platform similar to Lalamove tailored for the German market, connecting customers, drivers, and businesses for efficient delivery services.

## Project Structure

```
maxmove-monorepo/
├── backend/           # Node.js/Express.js server with Supabase integration (later we will include Golang microservices)
│   ├── src/           # Source code
│   │   ├── controllers/   # Request handlers 
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Core services (Supabase, etc.)
│   │   └── utils/         # Helper functions
├── frontend/
│   ├── web-ui/        # React web dashboards for customers, drivers, businesses, and admins
│   ├── customer-ui/   # React Native customer mobile app
│   └── driver-ui/     # React Native driver mobile app
├── shared/            # Shared utilities, types, and constants
├── docker-compose.yml # Docker configuration
├── package.json       # Root config with workspaces
└── README.md
```

## Tech Stack

- **Backend**: Node.js with Express.js (later Golang Microservices)
- **Database & Authentication**: Supabase (PostgreSQL with PostGIS for geospatial data)
- **Real-time Features**: Supabase real-time
- **Payment Integration**: Stripe
- **Mapping**:  Google Maps 
- **Frontend Web**: React, TypeScript, Next.js, ShadCN UI
- **Frontend Mobile**: React Native, Expo
- **Deployment**: Backend Railway, Frontend Web Ui Vercel, Frotnend customer ui and driver ui Expo

## API Overview

The MaxMove API provides endpoints for the following functionality:

- **Authentication**: Login, registration, and profile management
- **Orders**: Create, retrieve, update, and cancel delivery orders
- **Vehicles**: Manage vehicle types and characteristics
- **Users**: Profile management, wallet management
- **Payments**: Process payments via Stripe 
- **Drivers**: Driver management and tracking (coming soon)
- **mapping**: Google Maps (coming soon)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Maps API key (for mobile)
- Stripe account (for payments)
(- later Docker and Docker Compose (for containerized deployment))



## Frontend Apps

### Web UI (web-ui)
- Customer dashboard for placing orders
- Driver dashboard for accepting and managing deliveries
- Business dashboard for managing corporate accounts
- Admin dashboard for system management

### Customer Mobile App (customer-ui)
- Place and track orders
- Manage payment methods
- View order history
- Real-time tracking
- live communication with driver

### Driver Mobile App (driver-ui)
- Accept delivery requests
- Navigation assistance
- Update delivery status
- Manage earnings
-live communication with customer

