# Munchies

Fastify POS (Point-of-sale) app that provides transaction, product and user management by making use of Sequelize (ORM) and MySQL (database).

Munchies provides the following key features:

- Users are able to register and login using an email address and password
- CRUD operations of Products
- Link and unlink a product to another as an upsell product
- Create and fetch transactions

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

- From the response, copy the value of the token and paste it in the Development environment's 'token' variable
- Now you should have authenticated access for product and transaction related requests.

### Make Requests

Access granted! Now that you have authenticated access, you are able to send all other requests. The complete Postman documentation can be found [here](https://documenter.getpostman.com/view/34659780/2sA3duFshm).

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Authors

- [@codecventer](https://www.github.com/codecventer)
