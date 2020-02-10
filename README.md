<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src=".github/logo.png" width="300px" />
</h1>

<h3 align="center">
 Backend - FastFeet
</h3>


<blockquote align="center">“TO ACHIEVE WHAT OTHERS WONT, YOU HAVE TO DO WHAT OTHERS DON'T!”</blockquote>



<p align="center">
  <a href="#rocket-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-tools">Tools</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-functionalities">Functionalities</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

## :rocket: About the project

This is the backend to an app for a fictional carrier, the FastFeet.

This project is part of a complete application involving backend, frontend and mobile! (See my other repositories [comming soon])

## Tools

The created app uses [Express](https://expressjs.com/), in addition to needing to configure the following tolls:

- Sucrase + Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (PostgreSQL);

## Functionalities

### **1. Authentication**

Permita que um usuário se autentique em sua aplicação utilizando e-mail e uma senha.

Crie um usuário administrador utilizando a funcionalidade de [seeds do sequelize](https://sequelize.org/master/manual/migrations.html#creating-first-seed), essa funcionalidade serve para criarmos registros na base de dados de forma automatizada.

- A autenticação deve ser feita utilizando JWT.
- Realize a validação dos dados de entrada - YUP;

### 2. Addressee Management

O cadastro de destinatários só pode ser feito por administradores autenticados na aplicação.

O destinatário não pode se autenticar no sistema, ou seja, não possui senha.

## :memo: License

This project is under the MIT license. See the file [LICENSE](LICENSE.md) for more details.

---

Build with ♥ by Francisco Vaz :wave: from GoStack Bootcamp of RocketSeat [Join our community!](https://discordapp.com/invite/gCRAFhc)
