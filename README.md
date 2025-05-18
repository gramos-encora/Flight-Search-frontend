# ✈️ Flight Search Frontend

This is the frontend of the Flight Search application, built with **React** and powered by **Vite**. It allows users to search for flights between airports using the Amadeus API, with autocomplete and detailed results.

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- A `.env` file with your Amadeus API credentials:

```env
AMADEUS_KEY=your_key
AMADEUS_SECRET=your_secret
```

## 📦 Run the Application
Clone the repository:
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

Go to the backend repository and clone it also:

https://github.com/gramos-encora/Flight-Search-backend

Create this file structure:

```
FlightSearch
├── Flight-Search-backend/
│   └── flight-search/
├── Flight-Search/
│   └── flight-search/
├── .env
└── docker-compose.yml
```

docker-compose.yml
``` yml
version: '3.8'

services:
  backend:
    build:
      context: ./Flight-Search-backend/flight-search
      dockerfile: Dockerfile
    container_name: flight-backend
    ports:
      - "8080:8080"
    environment:
      AMADEUS_KEY: ${AMADEUS_KEY}
      AMADEUS_SECRET: ${AMADEUS_SECRET}
    networks:
      - flight-app
    restart: unless-stopped

  frontend:
    build:
      context: ./Flight-Search/flight-search
      dockerfile: Dockerfile
    container_name: flight-frontend
    ports:
      - "9090:9090"
    networks:
      - flight-app
    depends_on:
      - backend
    restart: unless-stopped

networks:
  flight-app:
    driver: bridge
```

## Start the application with Docker Compose:
```bash
docker compose up --build
```

Open your browser and go to: http://localhost:9090
The frontend runs on port 9090.
The backend runs on port 8080.
Both services are connected via the flight-app Docker network.

## 🧪 Running Tests

This project uses Vitest along with @testing-library/react.

To run the tests locally:
```bash
npm install
npm run test
```

Tests are colocated next to components and use the .test.tsx extension.
No special test server setup is needed; Vitest handles everything via jsdom.

## 🛠 Technologies Used

- React
- Vite
- TypeScript
- Vitest
- @testing-library/react
- Docker
- Docker Compose
