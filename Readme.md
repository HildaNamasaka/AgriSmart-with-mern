#  AgriSmart Kenya

A comprehensive farm management system designed for Kenyan farmers to track their agricultural operations, manage expenses and income, monitor market prices, and access weather information.

##  Live Demo

- **Frontend**: [https://agri-smart-with-mern.vercel.app](https://agri-smart-with-mern.vercel.app)
- **Backend API**: [https://agrismart-with-mern.onrender.com](https://agrismart-with-mern.onrender.com)

##  Features

###  Farm Management
- Create and manage multiple farms
- Track farm locations and sizes
- Monitor different crop types across farms

###  Activity Tracking
- Record farming activities (planting, weeding, fertilizing, harvesting, etc.)
- Track labor and time spent on each activity
- Monitor activity history and patterns

###  Financial Management
- **Expense Tracking**: Record all farm-related expenses by category
- **Income Recording**: Track sales and revenue from farm produce
- **Financial Analytics**: View total expenses, income, and profit margins
- Visual charts and graphs for financial insights

###  Marketplace
- List farm products for sale
- Browse available agricultural products
- Connect with buyers and sellers

###  Market Prices
- Real-time market price information for various crops
- County-specific pricing data
- Historical price trends

###  Weather Information
- Current weather conditions
- Weather forecasts
- Location-based weather data

###  Internationalization
- Multi-language support (English, Swahili)
- Easy language switching

###  Theme Support
- Light and Dark mode
- User preference saved locally

##  Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **i18next** - Internationalization
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

##  Project Structure

```
AgriSmart-Kenya/
├── Client/                  # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── common/    # Buttons, Cards, Inputs, etc.
│   │   │   ├── layout/    # Navbar, Footer, Layout
│   │   │   └── dashboard/ # Dashboard-specific components
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Login & Register
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Farms.jsx
│   │   │   ├── Activities.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── MarketPrices.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   └── Weather.jsx
│   │   ├── context/       # React Context (Auth, Theme)
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Helper functions & constants
│   │   ├── locales/       # Translation files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── Server/                 # Backend application
    ├── config/            # Database configuration
    ├── controllers/       # Route controllers
    ├── middleware/        # Custom middleware (auth, error handling)
    ├── models/            # Mongoose models
    ├── routes/            # API routes
    ├── server.js          # Entry point
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/agrismart-kenya.git
cd agrismart-kenya
```

2. **Setup Backend**
```bash
cd Server
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
EOF

# Start backend server
npm run dev
```

3. **Setup Frontend**
```bash
cd Client
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start frontend development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

##  Environment Variables

### Backend (.env)

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agrismart
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173


### Frontend (.env)

VITE_API_URL=http://localhost:5000/api


##  API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Farms
- `GET /api/farms` - Get all farms
- `POST /api/farms` - Create new farm
- `PUT /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

### Activities
- `GET /api/activities` - Get all activities
- `POST /api/activities` - Create activity
- `DELETE /api/activities/:id` - Delete activity

### Expenses
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `DELETE /api/expenses/:id` - Delete expense

### Income
- `GET /api/income` - Get all income records
- `POST /api/income` - Record income
- `DELETE /api/income/:id` - Delete income record

### Market Prices
- `GET /api/prices` - Get all prices
- `GET /api/prices/:crop/:county` - Get specific price
- `POST /api/prices` - Create price entry

### Listings
- `GET /api/listings` - Get all marketplace listings
- `POST /api/listings` - Create listing
- `DELETE /api/listings/:id` - Delete listing

##  Deployment

### Deploy Backend to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `Server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables
5. Deploy!

### Deploy Frontend to Vercel

1. Install Vercel CLI or use dashboard
2. Connect GitHub repository
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `Client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables
5. Deploy!


## Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Farm Management
![Farms](screenshots/farms.png)

### Login
![Expenses](screenshots/login.png)

### Marketplace
![Marketplace](screenshots/market.png)
