# Subtitle Management System  

This project is a **full-stack subtitle management system** built using **AdonisJS** for the backend and **React** for the frontend. It allows authenticated users to upload, manage, and fetch subtitle (`.srt`) files, with proper authentication, database integration, and Dockerized deployment support.  

---

## Features  
- User authentication and authorization (via AdonisJS middleware).  
- Upload, fetch, update, and delete `.srt` files.  
- Fetch all user-specific subtitles with metadata (ID, name, created date).  
- Relational database models (users, subtitles, tags, shows).  
- REST API design with structured routes.  
- Token-based authentication for frontend integration.  
- Docker support for easy deployment and local development.  
- Unit and integration testing setup.  
- UML diagrams and wireframes for requirements and design documentation.  

---

## Technologies Used  
- **Backend:** AdonisJS (Node.js framework with TypeScript).  
- **Database:** PostgreSQL (via Adonis Lucid ORM).  
- **Authentication:** Token-based (JWT / sessions).  
- **Frontend:** React with Axios for API requests.  
- **Deployment & Environment:** Docker, Docker Compose.  
- **Testing:** Japa (AdonisJS testing framework).  
- **Design:** Figma (UI/UX wireframes).  
- **Modeling:** UML diagrams for system requirements.  

---

## Directory Structure  
- **Requirements/** → Contains UML diagrams.  
- **Design/** → Contains Figma wireframes and UI/UX designs.  
- **Backend/** → Contains the AdonisJS application and Dockerfile for backend services.  
- **Uni-app/** → Contains the React application (frontend) and Dockerfile for frontend services.  
- **docker-compose.yml** → Located at the project root to build and run the full stack (backend, frontend, database).  

---

## Development Setup  

### Run with Docker (Recommended)  
1. Clone the repository.  
2. From the project root, run:  
   - `docker-compose up --build`  
3. Run database migrations inside the backend container.  
4. Access the frontend in the browser and connect it with the backend API.  

---

### Run Without Docker (Manual Setup)  
1. **Backend (AdonisJS)**  
   - Navigate into the `Backend` directory.  
   - Install dependencies: `npm install` or `yarn install`.  
   - Set up a local PostgreSQL database.  
   - Copy `.env.example` to `.env` and configure database connection and app keys.  
   - Run migrations: `node ace migration:run`.  
   - Start the server: `node ace serve --watch`.  

2. **Frontend (React)**  
   - Navigate into the `Uni-app` directory.  
   - Install dependencies: `npm install` or `yarn install`.  
   - Create a `.env` file with the backend API URL.  
   - Start the app: `npm start` or `yarn start`.  

---

## Testing  
- Unit and integration tests are implemented using **Japa** (Adonis) and **Jest** (React).  
- Run tests from the backend directory using the AdonisJS testing CLI and React Jest.  

---

## Docker Support  
- Each service (backend and frontend) has its own `Dockerfile`.  
- A single `docker-compose.yml` file at the root orchestrates the entire application stack.  
- Containers handle the API server, React app, and PostgreSQL database.  

---

## Future Work  
- Support for multiple subtitle formats beyond `.srt`.  
- Advanced search and tagging system.  
- Role-based user permissions.  
- Cloud deployment using AWS / GCP.  
- CI/CD integration for automated testing and deployment.  

---