# Indi.Fit Food Tracker

A full-stack food tracking application with user authentication, meal logging, and macro tracking.

## Overview

This project includes:
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT with protected routes
- **Validation:** Joi for request validation
- - **Testing:** Jest + Supertest for API tests

## Features

- User signup and login with hashed passwords
- JWT authentication and authorization for meal routes
- Daily meal tracking split into categories:
  - Breakfast
  - Lunch
  - Dinner
  - Snacks
  - Shakes
- Meal item details include calories, protein, carbs, fat, quantity, and unit
- Frontend dashboard with food selection, meal management, and macro summaries
- Backend validation for auth and meal inputs
- Basic API tests for auth and meal endpoints

## Project Structure

- `src/` — React frontend components and app logic
- `backend/` — Express server, controllers, routes, models, and validators
- `backend/tests/` — Jest and Supertest API tests

## Run Locally

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the backend server
   ```bash
   npm run dev
   ```
3. Open the frontend in development mode (if separately configured)
   ```bash
   npm run dev
   ```

> The backend server runs on `http://localhost:5000` by default.

## Testing

Run the backend test suite with:
```bash
npm test
```

## Notes

- Environment variables are stored in `backend/.env`
- Food data and meal records persist in MongoDB
- Validation is handled with Joi for auth and meal routes

## Improvements

Potential next steps for production readiness:
- Add rate limiting and security middleware
- Add request sanitization and improved error handling
- Add CI/CD and deployment scripts
- Add frontend session expiry handling
- Add more unit and integration tests
