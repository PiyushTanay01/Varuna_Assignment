FuelEU Maritime Compliance Dashboard

This is a full-stack project implementing a dashboard for the FuelEU Maritime regulation. It includes a React frontend and a Node.js/PostgreSQL backend, built using a Hexagonal (Ports & Adapters) architecture.

Overview

The application allows users to:

View and filter maritime routes and set a baseline.

Compare routes against the 2025 target intensity.

Calculate and manage a ship's Compliance Balance (CB).

Bank a surplus for future use (Article 20).

Apply a banked surplus to a deficit (Article 20).

Create a "pool" of ships to share compliance balances (Article 21).

Architecture

The project is divided into a frontend and backend, both adhering to a Hexagonal Architecture.

src/core: Contains the "inside" of the hexagon.

domain/: Pure, framework-independent types and logic (e.g., calculateComplianceBalance()).

ports/: Interfaces that define the "ports" for infrastructure (e.g., IRouteRepository, IComplianceApi).

application/: Use cases that orchestrate the domain and ports.

src/adapters: Contains the "outside" of the hexagon.

inbound/http: (Backend) Express controllers that adapt HTTP requests to use cases.

outbound/postgres: (Backend) Prisma repositories that implement the database ports.

infrastructure/api: (Frontend) API clients that implement the API ports.

ui/hooks & ui/components: (Frontend) React hooks and components that act as the UI adapter.

This design ensures that the core domain logic has zero dependency on frameworks like Express, React, or Prisma.

Setup & Run Instructions

Prerequisites

Node.js (v18+)

A cloud PostgreSQL database (e.g., from Aiven)

1. Backend Setup

Create a Database: Sign up for a free PostgreSQL database on Aiven or a similar cloud provider.

Configure Environment:

Find your database's Service URI (the connection string) from your Aiven dashboard.

Go to the backend folder and open the .env file.

Replace the placeholder DATABASE_URL with your Aiven Service URI. It will look something like this:
DATABASE_URL="postgresql://avnadmin:PASSWORD@pg-service-name.a.aivencloud.com:PORT/defaultdb?sslmode=require"

Install Dependencies:

cd backend
npm install


Run Migrations: This will connect to your Aiven database and create all the tables.

npx prisma migrate dev


Seed the Database: This will populate the routes table with test data.

npm run db:seed


Run the Server:

npm run dev


The backend API will be running at http://localhost:3001 and is connected to your cloud database.

2. Frontend Setup

Install Dependencies:

cd frontend
npm install


Run the Client:

npm run dev


The frontend will open in your browser (e.S., http://localhost:5173). The app is now fully functional.

How to Execute Tests

Unit and integration tests were not fully implemented within the time limit. Validation was performed manually via Postman and by building the frontend against the live API.

A sample test (using Jest) for the core domain logic would look like this:

src/core/domain/Compliance.test.ts

import { calculateComplianceBalance, TARGET_INTENSITY_2025 } from './Compliance';

describe('calculateComplianceBalance', () => {

  const ENERGY_CONVERSION_FACTOR = 41000;

  it('should return a positive surplus', () => {
    const actualIntensity = 88.5; // Compliant
    const fuelConsumption = 4800;
    const expectedEnergy = 4800 * ENERGY_CONVERSION_FACTOR;
    const expectedCB = (TARGET_INTENSITY_2025 - actualIntensity) * expectedEnergy;
    
    const result = calculateComplianceBalance(actualIntensity, fuelConsumption);
    expect(result).toBe(expectedCB);
    expect(result).toBeGreaterThan(0);
  });

  it('should return a negative deficit', () => {
    const actualIntensity = 92.3; // Not compliant
    const fuelConsumption = 600;
    const expectedEnergy = 600 * ENERGY_CONVERSION_FACTOR;
    const expectedCB = (TARGET_INTENSITY_2025 - actualIntensity) * expectedEnergy;

    const result = calculateComplianceBalance(actualIntensity, fuelConsumption);
    expect(result).toBe(expectedCB);
    expect(result).toBeLessThan(0);
  });
});


Sample API Requests

Get all routes:

curl http://localhost:3001/api/routes


Calculate CB for a ship:

curl http://localhost:3001/api/compliance/cb?shipId=R1001&year=2025


Create a valid pool:

curl -X POST http://localhost:3001/api/pools \
     -H "Content-Type: application/json" \
     -d '{"shipIds": ["R1001", "R1002"], "year": 2025}'


Response:

{
    "id": "clxkfcfya0004ek0s263e52kv",
    "year": 2025,
    "createdAt": "2025-11-10T10:30:00.000Z",
    "members": [
        {
            "id": "clxkfcfyb0005ek0s0qg0e6h7",
            "pool_id": "clxkfcfya0004ek0s263e52kv",
            "ship_id": "R1001",
            "cb_before": 164682239.9999993,
            "cb_after": 91787519.99999909
        },
        {
            "id": "clxkfcfyb0006ek0sbh8p9r97",
            "pool_id": "clxkfcfya0004ek0s263e52kv",
            "ship_id": "R1002",
            "cb_before": -72894720.00000021,
            "cb_after": 0
        }
    ]
}


Screenshots
Routes screenshots:
![alt text](<Screenshot (654).png>)![alt text](<Screenshot (655).png>)![alt text](<Screenshot (656).png>) ![alt text](<Screenshot (655)-1.png>)![alt text](<Screenshot (657).png>)![alt text](<Screenshot (658).png>) ![alt text](<Screenshot (657)-1.png>)![alt text](<Screenshot (659).png>) ![alt text](<Screenshot (658)-1.png>) ![alt text](<Screenshot (657)-2.png>)

Frontend Screenshots:
![alt text](<Screenshot (662).png>)![alt text](<Screenshot (663).png>)![alt text](<Screenshot (664).png>)![alt text](<Screenshot (665).png>)