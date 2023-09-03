<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
<h1 align="center">Pet Grooming API</h1>
  <p align="center">
    <a href="https://your-api-url.com">View Demo</a>
    ·
    <a href="https://github.com/conceptcodes/zoomies-api/issues">Report Bug</a>
    ·
    <a href="https://github.com/conceptcodes/zoomies-api/issues">Request Feature</a>
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

Welcome to the Pet Grooming API! This API provides a robust solution for pet owners, groomers, and administrators to manage pet grooming appointments seamlessly. It's designed to make pet grooming scheduling efficient and user-friendly.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- ![NodeJS [Node.js](https://nodejs.org/)](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![TypeScript [TypeScript](https://www.typescriptlang.org/)](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Express.js [Express.js](https://expressjs.com/)](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
- ![PostgreSQL [PostgreSQL](https://www.postgresql.org/)](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Docker [Docker](https://www.docker.com/)](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
- ![Jest [Jest](https://jestjs.io/)](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
- [Other dependencies or technologies]

### Features

- User Registration and Authentication
- Pet Management
- Appointment Scheduling
- Groomer Availability Management (if applicable)
- [Checkout Wiki](https://github.com/conceptcodes/zoomies-api/wiki) for more details

### What I Learned ?

- [List what you or your team learned while building this API]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Node.js](https://nodejs.org/) (Recommended version: [insert version])
- [NPM or Yarn](https://yarnpkg.com/) (Recommended version: [insert version])
- [PostgreSQL](https://www.postgresql.org/) (Recommended version: [insert version])

### Installation

To get this API up and running, follow these steps:

1. Clone the repo:

   ```sh
    git clone https://github.com/conceptcodes/zoomies-api.git
   ```

2. Navigate to the project directory:

   ```sh
   cd repo-name
   ```

3. Install dependencies:

   ```sh
   yarn install
   ```

4. Configure environment variables:

   - Create a `.env` file based on the provided `.env.example`.
   - Fill in the required configuration values.

   ```sh
   cp .env.example .env
   ```

5. Run DB Migration:

   ```sh
   yarn db:generate && yarn db:migrate
   ```

6. Start the server:

   ```sh
   yarn dev
   ```

7. Open [http://localhost:8000](http://localhost:8000) in your browser to interact with the API.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [ ] [Feature or task 1]
- [ ] [Feature or task 2]
- [ ] [Feature or task 3]
- [ ] [Feature or task 4]

See the [open issues](https://github.com/conceptcodes/zoomies-api/issues) for a full list of proposed features and known issues.

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

Project Link: [https://github.com/conceptcodes/zoomies-api](https://github.com/conceptcodes/zoomies-api)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/conceptcodes/zoomies-api.svg?style=for-the-badge
[contributors-url]: https://github.com/conceptcodes/zoomies-api/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/conceptcodes/zoomies-api.svg?style=for-the-badge
[forks-url]: https://github.com/conceptcodes/zoomies-api/network/members
[stars-shield]: https://img.shields.io/github/stars/conceptcodes/zoomies-api.svg?style=for-the-badge
[stars-url]: https://github.com/conceptcodes/zoomies-api/stargazers
[issues-shield]: https://img.shields.io/github/issues/conceptcodes/zoomies-api.svg?style=for-the-badge
[issues-url]: https://github.com/conceptcodes/zoomies-api/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/your-profile/
[product-screenshot]: public/screenshot.png
