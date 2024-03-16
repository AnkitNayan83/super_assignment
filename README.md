# Super technical test

## Table of Contents

-   [Prerequisites](#prerequisites)
-   [env setup](#env-setup)
-   [Installation](#installation)
-   [Running the Application](#running-the-application)
-   [Testing](#testing)
-   [Contributing](#contributing)

## Prerequisites

You need nodejs installed in your system. Installing docker is optional as I am pulling db image from docker, if you have your own db url just add it to your env file.

-   Node.js and npm - [Download](https://nodejs.org/)
-   Docker - [Download](https://www.docker.com/)

## env setup

Create a .env file in your root directory and add thease following keys:

### If not using docker

    PORT=3000
    DATABASE_URL="DB URL"
    JWT_SECRET=YOUR SECRET

### If using docker

    PORT=3000
    JWT_SECRET=YOUR SECRET
    POSTGRES_USER="YourName"
    POSTGRES_PASSWORD="YourPassword"
    POSTGRES_DB="myDb"
    DATABASE_URL="postgresql://YourName:YourPassword@localhost:5432/mydb?schema=public"

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/AnkitNayan83/super_assignment.git
    ```

2. Navigate to the project directory:

    ```bash
    cd super_assignment
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

## Running the Application

1. If using docker (Your docker should be open on your device):
    ```bash
    cd src/docker
    docker compose up
    ```
2. Start the development server:

    ```bash
    npm run dev
    ```

## Testing

1. To run the tests, execute the following command:

    ```bash
    npm run test
    ```

## Project Structure

The project structure is organized as follows:

-   **`src/`**: Contains the source code of the application.
    -   **`app.ts`**: Main file containing Express application setup.
    -   **`middleware/`**: Directory for middleware functions.
        -   **`errorMiddleware.ts`**: Error handling middleware.
        -   **`authMiddleware.ts`**: To create authenticated routes
    -   **`routes/`**: Directory for route handlers.
    -   **`utils/`**: Directory for utility functions.
    -   **`docker/docker-compose.yml`**: Docker Compose file for PostgreSQL database setup.
-   **`test/`**: Contains test files.
    -   **`demo.test.ts`**: Sample test file for demonstration.
-   **`prisma/`**: Contains Prisma schema and migrations.

-   **`jest.config.js`**: Configuration file for Jest testing framework.
-   **`tsconfig.json`**: TypeScript configuration file.
