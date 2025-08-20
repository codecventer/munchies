# Munchies - Point-of-Sale API Starter

A production-ready Point-of-Sale API starter built with Fastify, Sequelize ORM, and MySQL. Perfect for developers looking to quickly bootstrap a retail or restaurant POS system with essential commerce features.

## Key Features

- **User Authentication** - JWT-based registration and login system
- **Product Management** - Full CRUD operations for inventory management
- **Upselling System** - Link products as upsell recommendations
- **Transaction Processing** - Create and track sales transactions
- **RESTful API** - Clean, documented endpoints ready for frontend integration
- **Database Ready** - Pre-configured MySQL schema and migrations

Ideal for building retail systems, restaurant ordering platforms, or any commerce application requiring transaction management.

Please note, this README does not include the installation and setup of a local MySQL server.

## Getting Started

### Clone Repo

Clone the munchies repo:

```bash
git clone https://github.com/codecventer/munchies.git
```

Install munchies with npm:

```bash
cd munchies
npm i
```

### Setup Database

Run the provided SQL script, located at ```assets/Munchies_DB_Script.sql```, in your running local MySQL server.

### Setup Environment Variables

- Rename the ```example.env``` file to ```.env```
- Inside, replace the string value of the ```DB_CONNECTION_STRING``` variable with your own connection string

### Run the App

Run the munchies app:

```bash
npm run dev
```

Beware, for maintenance purposes, all unit tests must pass before running the application locally.

### Open Postman

Open Postman and import the Munchies Collection, located at ```assets/Munchies_Collection.postman_collection.json```.

### Get JWT Token

A valid JWT token is required for any product or transaction related requests. To obtain this:

- Send a Register User POST request:

```http
  POST /users/register
```

| Parameter | Type     |
| :-------- | :------- |
| `emailAddress` | `string` |
| `password` | `string` |

- Send a Login User POST request:

```http
  POST /users/login
```

| Parameter | Type     |
| :-------- | :------- |
| `emailAddress` | `string` |
| `password` | `string` |

- From the response, copy the value of the token and paste it in the (Postman) Development environment's 'token' variable
- Now you should have authenticated access for product and transaction related requests.

### Make Requests

Access granted! Now that you have authenticated access, you are able to send all other requests. The complete Postman documentation can be found [here](https://documenter.getpostman.com/view/34659780/2sA3duFshm).

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [@codecventer](https://www.github.com/codecventer)
