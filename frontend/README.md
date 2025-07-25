# Frontend (React.js SPA)

## Overview
This is the frontend for the AI Learning Management System, built as a modern React Single Page Application (SPA) with role-based routing and API integration.

### Key Technologies
- **React.js**: Component-based UI
- **React Router**: SPA routing
- **Axios/Fetch**: API calls
- **JWT**: Auth token management
- **Context API/Redux**: State management (optional)
- **Styled Components/CSS Modules**: Styling (optional)

## Folder Structure

```
frontend/
│
├── public/                # Static files (index.html, favicon, etc.)
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable React components
│   ├── pages/             # Page-level components (Dashboard, Login, etc.)
│   ├── routes/            # Route definitions, role-based routing
│   ├── services/          # API calls, auth, etc.
│   ├── utils/             # Helper functions
│   ├── App.js             # Main app component
│   └── index.js           # Entry point
├── tests/                 # Frontend tests
├── package.json
└── .env                   # Environment variables
```

## Best Practices
- Component-based architecture
- Role-based routing and access control
- Environment variables for API endpoints
- Centralized API and auth logic
- Linting & formatting
- Unit/integration tests

---

See each folder for more details and usage examples. 