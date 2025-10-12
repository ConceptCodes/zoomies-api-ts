<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
<h1 align="center">
  Zoomies API 🐶
</h1>
  <p align="center">
    <a href="https://github.com/conceptcodes/zoomies-api-ts/issues">Report Bug</a>
    ·
    <a href="https://github.com/conceptcodes/zoomies-api-ts/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#api-reference">API Reference</a>
      <ul>
        <li><a href="#base-url--authentication">Base URL & Authentication</a></li>
        <li><a href="#health">Health</a></li>
        <li><a href="#auth">Auth</a></li>
        <li><a href="#profile">Profile</a></li>
        <li><a href="#pets">Pets</a></li>
        <li><a href="#vets">Vets</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#appointments">Appointments</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

Zoomies is a robust API designed to streamline pet appointment management for businesses, pet owners, and veterinarians. This API provides a seamless solution for scheduling, managing, and tracking pet appointments, ensuring a smooth experience for all users.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- ![Bun [Bun](https://bun.sh)](https://img.shields.io/badge/bun-FFA500?style=for-the-badge&logo=bun&logoColor=white)
- ![TypeScript [TypeScript](https://www.typescriptlang.org/)](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Express.js [Express.js](https://expressjs.com/)](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![PostgreSQL [PostgreSQL](https://www.postgresql.org/)](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Docker [Docker](https://www.docker.com/)](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
- ![Drizzle Orm [Drizzle Orm](https://drizzle-orm.github.io/)](https://img.shields.io/badge/Drizzle%20Orm-FFA500?style=for-the-badge&logo=drizzle-orm&logoColor=white)


### Features

- **User Management**: Create and manage user accounts for pet owners, vets, and administrators
- **Pet Management**: Support for various pet types, breeds, and characteristics
- **Service Management**: Define and manage services offered by vets, including pricing and availability
- **Notifications**: Event-driven reminders via email and SMS (Twilio) for upcoming appointments
- **Appointment Scheduling**: Easy booking and management of appointments, including reminders and notifications
- **Reporting and Analytics**: Track appointment history, revenue, and user engagement (Coming Soon)
- **Payment Integration**: Seamless payment processing for services rendered (Coming Soon)
- [Checkout Wiki](https://github.com/conceptcodes/zoomies-api-ts/wiki) for more details


### What I Learned ?

- [List what you or your team learned while building this API]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) (Recommended version: 16+)
- [Bun](https://bun.sh) (Any package manager can be used)
- [PostgreSQL](https://www.postgresql.org/) (Recommended version: 13+)

### Installation

To get this API up and running, follow these steps:

1. Clone the repo:

   ```sh
    git clone https://github.com/conceptcodes/zoomies-api-ts.git
   ```

2. Navigate to the project directory:

   ```sh
   cd zoomies-api-ts
   ```

3. Install dependencies:

   ```sh
   bun install
   ```

4. Configure environment variables:

   - Create a `.env` file based on the provided `.env.example`.
   - Fill in the required configuration values.

   ```sh
   cp .env.example .env
   ```

5. Run DB Migration:

   ```sh
   bun run db:generate && bun run db:migrate
   ```

6. Start the server:

   ```sh
   bun run dev
   ```

   If everything works as expected, you should see the following message in your terminal:

   ```sh
   =====================================================
   ================= ENV: local ========================
   ===== Zoomies Api listening on PORT: 8000 ===========
   =====================================================
   ```

7. Make a request to our health check endpoint:

   ```sh
   curl http://localhost:8000/api/health/alive
   ```

   you should see the following response:

   ```json
   {
     "message": "PONG"
   }
   ```

### Environment Variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `NOTIFICATION_QUEUE_KEY` | Redis list key for immediate notification jobs | `zoomies:notifications` |
| `NOTIFICATION_SCHEDULED_QUEUE_KEY` | Redis sorted-set key for scheduled notification jobs | `zoomies:notifications:scheduled` |
| `NOTIFICATION_WORKER_POLL_INTERVAL_MS` | Worker idle wait time before re-polling when no messages are available | `1000` |
| `NOTIFICATION_SCHEDULED_BATCH_SIZE` | Maximum scheduled jobs moved to the live queue per poll | `50` |
| `APPOINTMENT_REMINDER_LEAD_MINUTES` | Minutes before an appointment that a reminder should be sent | `60` |
| `TWILIO_ACCOUNT_SID` | Twilio credential required to send SMS notifications | `N/A` |
| `TWILIO_AUTH_TOKEN` | Twilio credential required to send SMS notifications | `N/A` |
| `TWILIO_FROM_NUMBER` | Verified Twilio phone number or messaging service SID used as the sender | `N/A` |
| `TWILIO_DEFAULT_COUNTRY_CODE` | Prefix applied when a stored phone number lacks an E.164 country code | `+1` |

These settings complement the existing Redis configuration (`REDIS_URL`, `REDIS_TOKEN`, `REDIS_EXPIRES_IN_MINS`) and Twilio credentials. When `TWILIO_*` variables are absent, SMS notifications are skipped while email remains active.

### Testing

- Run unit tests with `bun test`
- Generate coverage reports with `bun test --coverage`

## API Reference

All endpoints are served under the `/api` prefix and expect JSON request/response bodies unless noted.

### Base URL & Authentication

- **Base URL** (local development): `http://localhost:8000/api`
- **Auth header**: Supply `Authorization: Bearer <JWT>` for any endpoint that requires authentication.
- **Identifier format**: Resource identifiers (`id`, `userId`, `petId`, etc.) are UUID v4 strings such as `6f8d0c8a-3fcf-4c83-8a41-16d3e6b1f5c2`.
- **Refresh token**: Successful login sets a `refreshToken` HTTP-only cookie used for session management.
- **Admin-only**: Endpoints flagged as admin-only require a token whose `role` claim is `ADMIN`.

### Health

#### `GET /api/health/alive`
- **Auth**: Not required
- **Description**: Liveness probe for uptime monitoring.
- **Sample request**
```bash
curl http://localhost:8000/api/health/alive
```
- **Sample response**
```json
{
  "message": "PONG"
}
```

#### `GET /api/health/status`
- **Auth**: Not required
- **Description**: Reports connectivity status for external integrations.
- **Sample request**
```bash
curl http://localhost:8000/api/health/status
```
- **Sample response**
```json
[
  { "service": "DATABASE", "connected": true },
  { "service": "RESEND", "connected": true }
]
```

### Auth

#### `POST /api/auth/register`
- **Auth**: Not required
- **Description**: Create a new user account and trigger email verification.
- **Sample request**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "super-secret",
    "fullName": "Sam Pup",
    "phoneNumber": "5551234567"
  }'
```
- **Sample response**
```json
{
  "message": "Verify your email address to complete registration."
}
```

#### `POST /api/auth/verify-email`
- **Auth**: Not required
- **Description**: Confirms a registration using the 6-digit verification code emailed to the user.
- **Sample request**
```bash
curl -X POST http://localhost:8000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "code": "123456"
  }'
```
- **Sample response**
```json
{
  "message": "Email verified successfully."
}
```

#### `POST /api/auth/login`
- **Auth**: Not required
- **Description**: Exchange credentials for an access token and refresh token.
- **Sample request**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@example.com",
    "password": "super-secret"
  }'
```
- **Sample response**
```json
{
  "message": "Login successful."
}
```
- Response includes an `Authorization: Bearer <jwt>` header and sets a `refreshToken` HTTP-only cookie.

#### `GET /api/auth/logout`
- **Auth**: Required
- **Description**: Invalidates the refresh token for the authenticated user.
- **Sample request**
```bash
curl http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer <jwt>"
```
- **Sample response**
```http
HTTP/1.1 200 OK
```
- If `notificationPreferences` is omitted, the previous settings are preserved. Valid channel values are `EMAIL`, `SMS`, and `PUSH` (PUSH delivery is pending provider integration). SMS notifications require valid Twilio credentials and phone numbers stored either in full E.164 format (e.g., `+15551234567`) or as national numbers that can be prefixed with `TWILIO_DEFAULT_COUNTRY_CODE`.

### Profile

#### `GET /api/profile`
- **Auth**: Required
- **Description**: Retrieve the authenticated user's profile details.
- **Sample request**
```bash
curl http://localhost:8000/api/profile \
  -H "Authorization: Bearer <jwt>"
```
- **Sample response**
```json
{
  "id": "6f8d0c8a-3fcf-4c83-8a41-16d3e6b1f5c2",
  "fullName": "Sam Pup",
  "phoneNumber": "5551234567",
  "email": "owner@example.com",
  "role": "USER",
  "notificationPreferences": {
    "channels": ["EMAIL"],
    "upcomingAppointments": {
      "enabled": true
    }
  }
}
```

#### `PATCH /api/profile`
- **Auth**: Required
- **Description**: Update the user's display name and notification preferences.
- **Sample request**
```bash
curl -X PATCH http://localhost:8000/api/profile \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Sam P. Owner",
    "notificationPreferences": {
      "channels": ["EMAIL"],
      "upcomingAppointments": {
        "enabled": true
      }
    }
  }'
```
- **Sample response**
```http
HTTP/1.1 200 OK
```

### Pets

#### `GET /api/pets`
- **Auth**: Required
- **Description**: List all pets owned by the authenticated user.
- **Sample request**
```bash
curl http://localhost:8000/api/pets \
  -H "Authorization: Bearer <jwt>"
```
- **Sample response**
```json
[
  {
    "id": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
    "name": "Rex",
    "age": 4,
    "type": "dog",
    "ownerId": "6f8d0c8a-3fcf-4c83-8a41-16d3e6b1f5c2",
    "createdAt": "2024-06-01T12:30:00.000Z",
    "updatedAt": "2024-06-01T12:30:00.000Z"
  }
]
```

#### `GET /api/pets/:id`
- **Auth**: Required
- **Description**: Fetch a single pet by ID (must belong to the requester).
- **Sample request**
```bash
curl http://localhost:8000/api/pets/1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3 \
  -H "Authorization: Bearer <jwt>"
```
- **Sample response**
```json
{
  "id": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
  "name": "Rex",
  "age": 4,
  "type": "dog",
  "ownerId": "6f8d0c8a-3fcf-4c83-8a41-16d3e6b1f5c2",
  "createdAt": "2024-06-01T12:30:00.000Z",
  "updatedAt": "2024-06-01T12:30:00.000Z"
}
```

- Returns `404 Not Found` if the requested pet does not belong to the authenticated owner.

#### `GET /api/pets/type/:type`
- **Auth**: Required
- **Description**: Filter the user's pets by species. Valid values include `dog`, `cat`, `bird`, `hamster`, `unknown`, `fish`, `rabbit`, `turtle`, `snake`, `lizard`, `guinea_pig`, `horse`, and `goat`.
- **Sample request**
```bash
curl http://localhost:8000/api/pets/type/dog \
  -H "Authorization: Bearer <jwt>"
```
- **Sample response**
```json
[
  {
    "id": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
    "name": "Rex",
    "age": 4,
    "type": "dog",
    "ownerId": "6f8d0c8a-3fcf-4c83-8a41-16d3e6b1f5c2",
    "createdAt": "2024-06-01T12:30:00.000Z",
    "updatedAt": "2024-06-01T12:30:00.000Z"
  }
]
```

#### `POST /api/pets`
- **Auth**: Required
- **Description**: Register a new pet for the authenticated user.
- **Sample request**
```bash
curl -X POST http://localhost:8000/api/pets \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rex",
    "type": "dog",
    "age": 4
  }'
```
- **Sample response**
```json
{
  "message": "Pet created successfully"
}
```

#### `PATCH /api/pets`
- **Auth**: Required
- **Description**: Update an existing pet. Provide the pet ID and new attributes.
- **Sample request**
```bash
curl -X PATCH http://localhost:8000/api/pets \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
    "name": "Rex",
    "type": "dog",
    "age": 5
  }'
```
- **Sample response**
```json
{
  "message": "Pet updated successfully"
}
```
- Response status code is `204 No Content`.

#### `DELETE /api/pets/:id`
- **Auth**: Required
- **Description**: Remove a pet owned by the authenticated user.
- **Sample request**
```bash
curl -X DELETE http://localhost:8000/api/pets/1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3 \
  -H "Authorization: Bearer <jwt>"
```
- **Sample response**
```json
{
  "message": "Pet deleted successfully"
}
```
- Response status code is `204 No Content`. Returns `404 Not Found` if the pet is not associated with the authenticated owner.

### Vets

#### `GET /api/vets`
- **Auth**: Required
- **Description**: List every vet profile and their clinic availability settings.
- **Sample request**
```bash
curl http://localhost:8000/api/vets \
  -H "Authorization: Bearer <jwt>"
```
- **Sample response**
```json
[
  {
    "id": "5f8a77a0-52c9-4186-9e85-4f4f1abcb4f9",
    "userId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
    "allowedPetTypes": ["dog", "cat"],
    "startHour": 9,
    "endHour": 17,
    "days": 5,
    "createdAt": "2024-07-01T09:00:00.000Z",
    "updatedAt": "2024-07-01T09:00:00.000Z"
  }
]
```

#### `GET /api/vets/:id`
- **Auth**: Required
- **Description**: Fetch a specific vet profile by the vet's user ID.
- **Sample request**
```bash
curl http://localhost:8000/api/vets/1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3 \
  -H "Authorization: Bearer <jwt>"
```
- **Sample response**
```json
{
  "id": "5f8a77a0-52c9-4186-9e85-4f4f1abcb4f9",
  "userId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
  "allowedPetTypes": ["dog", "cat"],
  "startHour": 9,
  "endHour": 17,
  "days": 5,
  "createdAt": "2024-07-01T09:00:00.000Z",
  "updatedAt": "2024-07-01T09:00:00.000Z"
}
```
- Returns `404 Not Found` if no vet profile exists for the supplied user ID.

#### `POST /api/vets`
- **Auth**: Required (`ADMIN` only)
- **Description**: Create a vet profile for an onboarded user.
- **Sample request**
```bash
curl -X POST http://localhost:8000/api/vets \
  -H "Authorization: Bearer <admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
    "allowedPetTypes": ["dog", "cat"],
    "startHour": 9,
    "endHour": 17,
    "days": 5
  }'
```
- **Sample response**
```json
{
  "id": "5f8a77a0-52c9-4186-9e85-4f4f1abcb4f9",
  "userId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
  "allowedPetTypes": ["dog", "cat"],
  "startHour": 9,
  "endHour": 17,
  "days": 5,
  "createdAt": "2024-07-01T09:00:00.000Z",
  "updatedAt": "2024-07-01T09:00:00.000Z"
}
```

#### `PATCH /api/vets/:id`
- **Auth**: Required (admin or the vet updating their own profile)
- **Description**: Update a vet's clinic availability or supported pet types.
- **Sample request**
```bash
curl -X PATCH http://localhost:8000/api/vets/1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3 \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "startHour": 8,
    "endHour": 16,
    "allowedPetTypes": ["dog", "cat", "rabbit"]
  }'
```
- **Sample response**
```json
{
  "id": "5f8a77a0-52c9-4186-9e85-4f4f1abcb4f9",
  "userId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
  "allowedPetTypes": ["dog", "cat", "rabbit"],
  "startHour": 8,
  "endHour": 16,
  "days": 5,
  "createdAt": "2024-07-01T09:00:00.000Z",
  "updatedAt": "2024-07-03T09:30:00.000Z"
}
```
- Authorization fails with `400 Invalid role` if a non-admin user attempts to manage another vet's profile.

### Services

#### `GET /api/services`
- **Auth**: Not required
- **Description**: List the services offered by the clinic.
- **Sample request**
```bash
curl http://localhost:8000/api/services
```
- **Sample response**
```json
[
  {
    "id": "0c9f1e73-7b52-4c3f-9a3d-26a4cd6b9e12",
    "name": "Annual Wellness Exam",
    "description": "Full physical exam and consultation.",
    "applicablePetTypes": ["dog", "cat"],
    "price": 8500,
    "createdAt": "2024-06-01T12:00:00.000Z",
    "updatedAt": "2024-06-01T12:00:00.000Z"
  }
]
```

#### `GET /api/services/:id`
- **Auth**: Not required
- **Description**: Retrieve a specific service by ID.
- **Sample request**
```bash
curl http://localhost:8000/api/services/0c9f1e73-7b52-4c3f-9a3d-26a4cd6b9e12
```
- **Sample response**
```json
{
  "id": "0c9f1e73-7b52-4c3f-9a3d-26a4cd6b9e12",
  "name": "Annual Wellness Exam",
  "description": "Full physical exam and consultation.",
  "applicablePetTypes": ["dog", "cat"],
  "price": 8500,
  "createdAt": "2024-06-01T12:00:00.000Z",
  "updatedAt": "2024-06-01T12:00:00.000Z"
}
```

#### `POST /api/services`
- **Auth**: Required (admin only)
- **Description**: Create a new service.
- **Sample request**
```bash
curl -X POST http://localhost:8000/api/services \
  -H "Authorization: Bearer <admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dental Cleaning",
    "description": "Comprehensive cleaning and polish.",
    "applicablePetTypes": ["dog"],
    "price": 12000
  }'
```
- **Sample response**
```json
{
  "id": "8dbbb4d0-1f3e-43df-9465-9a6b61c35dcb",
  "name": "Dental Cleaning",
  "description": "Comprehensive cleaning and polish.",
  "applicablePetTypes": ["dog"],
  "price": 12000,
  "createdAt": "2024-06-15T09:00:00.000Z",
  "updatedAt": "2024-06-15T09:00:00.000Z"
}
```

#### `PATCH /api/services`
- **Auth**: Required (admin only)
- **Description**: Update an existing service.
- **Sample request**
```bash
curl -X PATCH http://localhost:8000/api/services \
  -H "Authorization: Bearer <admin-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "8dbbb4d0-1f3e-43df-9465-9a6b61c35dcb",
    "name": "Dental Cleaning",
    "description": "Updated description for the dental cleaning service.",
    "price": 12500
  }'
```
- **Sample response**
```json
{
  "id": "8dbbb4d0-1f3e-43df-9465-9a6b61c35dcb",
  "name": "Dental Cleaning",
  "description": "Updated description for the dental cleaning service.",
  "applicablePetTypes": ["dog"],
  "price": 12500,
  "createdAt": "2024-06-15T09:00:00.000Z",
  "updatedAt": "2024-06-20T09:00:00.000Z"
}
```

#### `DELETE /api/services/:id`
- **Auth**: Required (admin only)
- **Description**: Remove a service from the catalog.
- **Sample request**
```bash
curl -X DELETE http://localhost:8000/api/services/8dbbb4d0-1f3e-43df-9465-9a6b61c35dcb \
  -H "Authorization: Bearer <admin-jwt>"
```
- **Sample response**
```http
HTTP/1.1 204 No Content
```

### Appointments

#### `GET /api/appointment`
- **Auth**: Required (admin only)
- **Description**: List all appointments across the system. Use user-specific endpoints for non-admin access.
- **Sample request**
```bash
curl http://localhost:8000/api/appointment \
  -H "Authorization: Bearer <admin-jwt>"
```
- **Sample response**
```json
[
  {
    "id": "3a7d2e5b-9f48-4d2d-a0c8-df5c7ba4e123",
    "petId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
    "vetId": "2c4d9f86-1a2b-4ce7-8d9f-7ad6245f9c30",
    "serviceId": "0c9f1e73-7b52-4c3f-9a3d-26a4cd6b9e12",
    "userId": "6f8d0c8a-3fcf-4c83-8a41-16d3e6b1f5c2",
    "date": "2024-07-12T14:00:00.000Z",
    "description": "Follow-up consultation",
    "duration": 45,
    "createdAt": "2024-06-20T15:10:00.000Z",
    "updatedAt": "2024-06-20T15:10:00.000Z"
  }
]
```

#### `GET /api/appointment/:id`
- **Auth**: Required
- **Description**: Retrieve a single appointment by ID.
- **Sample request**
```bash
curl http://localhost:8000/api/appointment/3a7d2e5b-9f48-4d2d-a0c8-df5c7ba4e123 \
  -H "Authorization: Bearer <jwt>"
```
- **Sample response**
```json
{
  "id": "3a7d2e5b-9f48-4d2d-a0c8-df5c7ba4e123",
  "petId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
  "vetId": "2c4d9f86-1a2b-4ce7-8d9f-7ad6245f9c30",
  "serviceId": "0c9f1e73-7b52-4c3f-9a3d-26a4cd6b9e12",
  "userId": "6f8d0c8a-3fcf-4c83-8a41-16d3e6b1f5c2",
  "date": "2024-07-12T14:00:00.000Z",
  "description": "Follow-up consultation",
  "duration": 45,
  "createdAt": "2024-06-20T15:10:00.000Z",
  "updatedAt": "2024-06-20T15:10:00.000Z"
}
```

#### `POST /api/appointment`
- **Auth**: Required
- **Description**: Schedule a new appointment. The `userId` must match the authenticated user.
- **Sample request**
```bash
curl -X POST http://localhost:8000/api/appointment \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "petId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
    "vetId": "2c4d9f86-1a2b-4ce7-8d9f-7ad6245f9c30",
    "serviceId": "0c9f1e73-7b52-4c3f-9a3d-26a4cd6b9e12",
    "date": "2024-07-12T14:00:00.000Z",
    "description": "Follow-up consultation",
    "duration": 45
  }'
```
- **Sample response**
```json
{
  "id": "f08f1a96-5d7e-4b6c-a8af-4a0d3e95cb21",
  "petId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
  "vetId": "2c4d9f86-1a2b-4ce7-8d9f-7ad6245f9c30",
  "serviceId": "0c9f1e73-7b52-4c3f-9a3d-26a4cd6b9e12",
  "userId": "6f8d0c8a-3fcf-4c83-8a41-16d3e6b1f5c2",
  "date": "2024-07-12T14:00:00.000Z",
  "description": "Follow-up consultation",
  "duration": 45,
  "createdAt": "2024-06-25T08:00:00.000Z",
  "updatedAt": "2024-06-25T08:00:00.000Z"
}
```
- The authenticated user's ID is injected server-side. A reminder job is queued using the `APPOINTMENT_REMINDER_LEAD_MINUTES` offset before the appointment time and will dispatch via every channel enabled in the user's notification preferences (email is always available; SMS depends on Twilio configuration).

#### `PATCH /api/appointment`
- **Auth**: Required
- **Description**: Update an appointment's details (currently limited to `petId`, `serviceId`, and `date`).
- **Sample request**
```bash
curl -X PATCH http://localhost:8000/api/appointment \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "f08f1a96-5d7e-4b6c-a8af-4a0d3e95cb21",
    "petId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
    "serviceId": "0c9f1e73-7b52-4c3f-9a3d-26a4cd6b9e12",
    "date": "2024-07-19T15:30:00.000Z"
  }'
```
- **Sample response**
```json
{
  "id": "f08f1a96-5d7e-4b6c-a8af-4a0d3e95cb21",
  "petId": "1b0d6a54-2c46-4efa-90b8-4c064fd2e1a3",
  "vetId": "2c4d9f86-1a2b-4ce7-8d9f-7ad6245f9c30",
  "serviceId": "0c9f1e73-7b52-4c3f-9a3d-26a4cd6b9e12",
  "userId": "6f8d0c8a-3fcf-4c83-8a41-16d3e6b1f5c2",
  "date": "2024-07-19T15:30:00.000Z",
  "description": "Follow-up consultation",
  "duration": 45,
  "createdAt": "2024-06-25T08:00:00.000Z",
  "updatedAt": "2024-06-26T10:00:00.000Z"
}
```

#### `DELETE /api/appointment/:id`
- **Auth**: Required (admin only)
- **Description**: Remove an appointment.
- **Sample request**
```bash
curl -X DELETE http://localhost:8000/api/appointment/f08f1a96-5d7e-4b6c-a8af-4a0d3e95cb21 \
  -H "Authorization: Bearer <admin-jwt>"
```
- **Sample response**
```json
{
  "message": "Appointment deleted successfully"
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] Add Unit and Integration Tests
- [ ] Implement CI/CD Pipeline
- [ ] Add a logging system


See the [open issues](https://github.com/conceptcodes/zoomies-api-ts/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome and encouraged! Here's how you can contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat(scope): Add some AmazingFeature (fixes #123)'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Don't forget to give the project a star if you find it helpful! 😄

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

[David Ojo] - [@conceptcodes] - [conceptcodes@gmail.com]

Project Link: [https://github.com/conceptcodes/zoomies-api-ts](https://github.com/conceptcodes/zoomies-api-ts/wiki)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/conceptcodes/zoomies-api-ts.svg?style=for-the-badge
[contributors-url]: https://github.com/conceptcodes/zoomies-api-ts/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/conceptcodes/zoomies-api-ts.svg?style=for-the-badge
[forks-url]: https://github.com/conceptcodes/zoomies-api-ts/network/members
[stars-shield]: https://img.shields.io/github/stars/conceptcodes/zoomies-api-ts.svg?style=for-the-badge
[stars-url]: https://github.com/conceptcodes/zoomies-api-ts/stargazers
[issues-shield]: https://img.shields.io/github/issues/conceptcodes/zoomies-api-ts.svg?style=for-the-badge
[issues-url]: https://github.com/conceptcodes/zoomies-api-ts/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/david-ojo-66a12a147/
