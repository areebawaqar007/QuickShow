# 🎬 QuickShow – Online Ticket Booking Platform

QuickShow is a full-stack movie ticketing app. Moviegoers can pick a show, choose seats on a visual map, and pay online, while admins manage shows and watch bookings and revenue. Confirmation and reminder emails go out automatically.

**🔗 Live Demo:** [quick-show-roan.vercel.app](https://quick-show-roan.vercel.app/)

---

## ✨ Features

### 👤 User
- Create an account and log in securely
- Search and filter movies by genre, rating, and release date
- Read movie details and watch trailers
- Pick seats on an interactive layout that shows what's still available
- Pay through Stripe checkout
- Review your bookings and keep a list of favorite movies

### 🛠️ Admin
- Dashboard with booking and revenue stats
- Add, edit, and remove shows
- See every customer booking in one list
- Add new movies with details and media
- Set up theater layouts and seat arrangements

### ⚙️ Platform
- Mobile-first, responsive interface built with Tailwind CSS
- Booked seats are held so two people can't reserve the same one
- Images served and optimized through Cloudinary
- Inngest background jobs handle emails and reminders
- Input validation with clear error messages

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Database** | MongoDB, Mongoose |
| **Payments** | Stripe |
| **Background Jobs** | Inngest |
| **Email** | Brevp ,Nodemailer |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
quickshow/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Reusable UI (+ admin components)
│       ├── pages/          # Route pages (+ admin pages)
│       ├── context/        # Global app state
│       └── lib/            # Date, time, and format helpers
└── server/                 # Express API
    ├── configs/            # Database and mailer setup
    ├── controllers/        # Request handling logic
    ├── inngest/            # Background job functions
    ├── middleware/         # Auth protection
    ├── models/             # User, Movie, Show, Booking
    └── routes/             # User, show, booking, admin routes
```

---

## 🔌 API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | User registration |
| POST | `/api/users/login` | User login |
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update user profile |

### Shows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shows` | Get all shows |
| GET | `/api/shows/:id` | Get show details |
| POST | `/api/admin/shows` | Create new show *(Admin)* |
| PUT | `/api/admin/shows/:id` | Update show *(Admin)* |
| DELETE | `/api/admin/shows/:id` | Delete show *(Admin)* |

### Bookings & Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create new booking |
| GET | `/api/bookings/user` | Get user bookings |
| GET | `/api/admin/bookings` | Get all bookings *(Admin)* |
| PUT | `/api/bookings/:id` | Update booking status |
| POST | `/api/bookings/create-payment-intent` | Create Stripe payment intent |
| POST | `/api/webhooks/stripe` | Handle Stripe webhooks |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database
- Stripe, Cloudinary,brevo and Inngest accounts

### Installation

```bash
git clone https://github.com/<your-username>/quickshow.git
cd quickshow

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```


### Environment Variables

Create a `.env` file in each folder and add your own values.

**`server/.env`**
```env
MONGODB_URI                  # MongoDB database connection URI
CLERK_PUBLISHABLE_KEY        # Clerk public key for authentication
CLERK_SECRET_KEY             # Clerk secret key for server-side authentication
INNGEST_EVENT_KEY            # Inngest key for sending background job events
INNGEST_SIGNING_KEY          # Inngest key for verifying incoming event requests
TMDB_API_KEY                 # TMDB API key for fetching movie information
STRIPE_PUBLISHABLE_KEY       # Stripe publishable key for payment integration
STRIPE_SECRET_KEY            # Stripe secret key for server-side payment processing
STRIPE_WEBHOOK_SECRET        # Stripe webhook secret for verifying webhook events
SENDER_EMAIL                 # Sender email address for application emails
SMTP_USER                    # SMTP username for email authentication
SMTP_PASSWORD                # SMTP password or app-specific password
```

**`client/.env`**
```env
VITE_CLERK_PUBLISHABLE_KEY   # Clerk publishable key for frontend authentication
VITE_CURRENCY                # Default currency symbol displayed in the application
VITE_BASE_URL                # Backend API base URL
VITE_TMDB_IMAGE_BASE_URL     # Base URL for TMDB movie images and posters
```


## 🌐 Deployment

The client and server are deployed as two separate Vercel projects, each with its own `vercel.json`. Add your environment variables in Vercel and point the Stripe webhook to the deployed server's webhook route.

---

## 🤝 Contributing

Ideas and pull requests are welcome. Fork the repo, create a branch, and open a PR describing your change.

---

