# Backend (Node.js/Express)

## Overview
This is the backend for the AI Learning Management System, built with Node.js and Express.js, following best practices for scalability, security, and maintainability.

### Key Technologies
- **Node.js & Express.js**: REST API
- **MongoDB Atlas**: Cloud NoSQL database
- **JWT**: Authentication
- **Redis**: Caching/session management
- **Apache Kafka**: Event streaming
- **Google Cloud Storage**: File storage
- **AI/ML API**: Generative tasks (quiz, recommendations)

## Folder Structure

```
backend/
│
├── src/
│   ├── config/         # Config files (DB, JWT, Redis, Kafka, GCS)
│   ├── controllers/    # Route controllers (business logic)
│   ├── middleware/     # Express middleware (auth, role-check, etc.)
│   ├── models/         # Mongoose models (User, Course, Quiz, etc.)
│   ├── routes/         # Express route definitions
│   ├── services/       # Service layer (DB, AI/ML, GCS, Kafka, etc.)
│   ├── utils/          # Utility/helper functions
│   ├── app.js          # Express app setup
│   └── server.js       # Entry point
├── tests/              # Backend tests
├── package.json
└── .env                # Environment variables
```

## Best Practices
- Layered architecture (controllers, services, models)
- Environment variables for secrets/config
- Centralized error handling
- JWT authentication & role-based access
- Async/await for all DB/API calls
- Linting & formatting
- Unit/integration tests

---

See each folder for more details and usage examples. 