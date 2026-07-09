The Wild Oasis — Customer-Facing App

The Wild Oasis Customer-Facing App is a modern cabin rental web application built for guests who want to explore,
reserve, and manage stays at The Wild Oasis. It provides a clean customer experience for browsing luxury cabins, viewing
cabin details, signing in with Google, creating reservations, and managing guest profile and booking information.

Developed by Ali Shapoori.

Overview

This project is the customer-facing side of The Wild Oasis cabin management system. It allows users to discover
available cabins, filter them by capacity, authenticate securely, reserve cabins for selected dates, and manage their
reservations from a personal guest area.

The application is built with Next.js, React, TypeScript, Supabase, NextAuth, Redux Toolkit, and Tailwind CSS.

Features Browse luxury cabins with detailed information Filter cabins by guest capacity View individual cabin pages with
pricing, capacity, images, and descriptions Reserve cabins using a date-based booking flow Prevent reservations for
already booked date ranges Google authentication with NextAuth Automatic guest profile creation after first sign-in
Protected guest account area View existing reservations Update future reservations Delete future reservations Update
guest profile details for smoother check-in Supabase-powered backend for cabins, bookings, guests, and settings
Responsive and modern user interface Server-side data fetching and server actions with the Next.js App Router Tech Stack
Framework: Next.js Language: TypeScript UI: React, Tailwind CSS Authentication: NextAuth with Google provider Database /
Backend: Supabase State Management: Redux Toolkit, React Redux Date Handling: date-fns, React DayPicker Icons: Heroicons
Linting: ESLint Project Structure . ├── app │ ├── \_components # Reusable UI components │ ├── \_lib # Data services,
auth, store, actions, Supabase client │ ├── \_styles # Global styles │ ├── about # About page │ ├── account # Protected
guest account pages │ ├── api # API/auth routes │ ├── cabins # Cabin listing, cabin details, reservation flow │ ├──
login # Sign-in page │ ├── layout.tsx # Root layout │ └── page.tsx # Home page ├── public # Static assets ├── types #
TypeScript type definitions ├── next.config.ts # Next.js configuration ├── proxy.ts # Authentication proxy configuration
├── package.json # Scripts and dependencies └── tsconfig.json # TypeScript configuration Getting Started Prerequisites

Make sure you have the following installed:

Node.js npm Installation

Clone the repository:

git clone https://github.com/alish-shady/The-Wild-Oasis-Customer-Facing-App.git

Navigate into the project directory:

cd The-Wild-Oasis-Customer-Facing-App

Install dependencies:

npm install Environment Variables

Create a .env.local file in the root directory and add the required environment variables:

SUPABASE_URL=your_supabase_project_url SUPABASE_KEY=your_supabase_key

AUTH_GOOGLE_ID=your_google_oauth_client_id AUTH_GOOGLE_SECRET=your_google_oauth_client_secret
AUTH_SECRET=your_auth_secret

RESTCOUNTRIES_KEY=your_restcountries_api_key

The application expects a configured Supabase project with the required tables and storage resources used by the app,
including cabins, bookings, guests, settings, and cabin images.

Running the Application

Start the development server:

npm run dev

Open the application in your browser:

http://localhost:3000 Available Scripts npm run dev

Runs the application in development mode.

npm run build

Builds the application for production.

npm run start

Starts the production server after building.

npm run prod

Builds the application and starts the production server.

npm run lint

Runs the project linter.

Main Routes Route Description / Home page /about About The Wild Oasis /cabins Cabin listing and filtering
/cabins/[cabinId] Individual cabin details and reservation flow /cabins/thankyou Reservation confirmation page /login
Google sign-in page /account Protected guest dashboard /account/reservations Guest reservations /account/profile Guest
profile management Authentication

The app uses Google authentication through NextAuth. After a successful sign-in, the application checks whether the user
already exists as a guest. If not, a new guest profile is created automatically.

Protected account pages require authentication before users can access their reservations or profile information.

Database Functionality

The app communicates with Supabase to manage:

Cabin data Cabin pricing and capacity Guest records Booking records Booked date ranges Application settings

Reservation actions include validation to avoid double-booking cabins and to prevent updates or deletion of past
bookings.

Deployment

This is a Next.js application and can be deployed to platforms such as Vercel, Netlify, or any environment that supports
Node.js-based Next.js apps.

Before deploying, make sure all production environment variables are configured in your hosting provider.

Author

Ali Shapoori

Developed by Ali Shapoori as the customer-facing web application for The Wild Oasis cabin rental system.

License

No license has been specified for this repository yet.
