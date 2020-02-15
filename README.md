<h1 align="center">
  <img alt="Fastfeet" src=".vscode/logo.png" width="300px" />
</h1>

<h3 align="center">
 Backend - FastFeet
</h3>


<blockquote align="center">“TO ACHIEVE WHAT OTHERS WONT, YOU HAVE TO DO WHAT OTHERS DON'T!”</blockquote>



<p align="center">
  <a href="#rocket-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#construction_worker-tools">Tools</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#pencil2-functionalities">Functionalities</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

## :rocket: About the project

This is the backend to an app for a fictional carrier, the FastFeet.

This project is part of a complete application involving backend, frontend and mobile! (See my other repositories [comming soon])

## :construction_worker: Tools

The created app uses [Express](https://expressjs.com/), in addition to needing to configure the following tolls:

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (PostgreSQL);
- [MORE TOLLS WITH THE RESOLUTION OF THE PROJECT]

## :pencil2: Functionalities

### **1. Authentication**

Allow a user to authenticate to the application using email and password

Create an administrator user using the functionality of  [seeds do sequelize](https://sequelize.org/master/manual/migrations.html#creating-first-seed), this functionality works for create records in the database in an automated way.

- The authentication must be done using JWT.
- Perform input data validation with YUP - a Javascript schema

### 2. Addressee Management

The registration of recipients can only be done by administrators authenticated in the application.

The recipient can't authenticate himself in the system, that is, he doens't have a password.

## :memo: License

This project is under the MIT license. See the file [LICENSE](LICENSE.md) for more details.

---

Build with ♥ by Francisco Vaz :wave: from GoStack Bootcamp of RocketSeat [Join our community!](https://discordapp.com/invite/gCRAFhc)
