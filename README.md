
# YouApp Backend Test

This project is a backend implementation for login, profile management, and chat features using NestJS, MongoDB, and Node.js, containerized with Docker. The system follows best practices in authentication (JWT), data validation (DTO), real-time communication (Socket.io), and unit testing.

The chat functionality is designed with object-oriented programming and efficient data structures, ensuring optimal schema planning and microservices in NoSQL.

### Features Implemented
    1. Authentication & Profile Management

    JWT-based authentication (signup/login).
    Profile creation & update (fields extracted from Figma, including horoscope & zodiac).
    User validation using DTO for structured API requests.

    2. Real-time Chat System

    Private messaging between users (User A ↔ User B).
    Message history storage in MongoDB.
    RabbitMQ-based message notification for real-time updates.
    Socket.io for live chat experience.

    3. CRUD Operations & Schema Design

    Well-structured NoSQL schema for login, profile, and chat.
    Object-oriented programming principles applied in service layers.
    Efficient data structures for handling chat storage and retrieval.




## Installation

Clone nestjs-backend-youapp from github

```bash
  git clone https://github.com/baagas0/nestjs-backend-youapp.git
  cd nestjs-backend-youapp
  npm install
  set-up envirolment
  npm run start:dev
```

Feel free to using my env
```bash
    MONGODB_URL="mongodb+srv://ditya:Ab123456@cluster0.iyo6m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    MONGODB_DATABASE="youapp-test"

    JWT_SECRET="secretkey"
```
    
## Documentation
Make sure youre running properly

[Documentation Swagger](https://localhost:3000/api-docs/#)

## Docker Compose
To build with docker and running up

```bash
    docker-compose up --build
```