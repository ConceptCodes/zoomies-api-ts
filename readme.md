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
- **Real-time Updates**: Stay informed with instant notifications and updates
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
