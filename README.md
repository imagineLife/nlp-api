# NLP-API

This hopes to cover some [Natural Language Processing](https://en.wikipedia.org/wiki/Natural_language_processing) use-cases through a rest api.  
This is intended to start as a presidential-inaugural-address collection, with some nlp processing applied to the speech text.

- [NLP-API](#nlp-api)
  - [Use A MongoDB Datastore](#use-a-mongodb-datastore)
  - [Run With Docker](#run-with-docker)
  - [Getting Data Into The DB](#getting-data-into-the-db)
  - [Authentication](#authentication)
    - [Authenticating a browser](#authenticating-a-browser)
    - [Authenticating a user](#authenticating-a-user)

## Use A MongoDB Datastore

This is expected to connect to a [mongodb](https://www.mongodb.com/) data store.  
Setup some env vars: i think for now i'd recommend `your.env` file.

```env
MONGO_AUTH=false
MONGO_DB_HOST=<your-mongo-hostname>
MONGO_DB_PORT=<your-mongo-port>
MONGO_DB_USER=<your-db-username>
MONGO_DB_PW=<your-db-pw>
SERVER_PORT=<a-port-for-the-api>
```

- `server_port` can be a port you'd like to use to expose the api on. The default port, expressed in the code, is `3000`

## Run With Docker

- `cd` into this directory & build the api image: something like `docker build -t nlp-api:1 .`
- run the image as a container: something like `docker run --name nlp --env-file <>your.env -p 3000:3000 nlp:1`

## Getting Data Into The DB

[Here's some thoughts](/LOADING-DATA.md) on loading data into the db

## Authentication

A series of "handshakes" are provided so that a browser, as well as a user, can be authenticated to "use" the api.

### Authenticating a browser

2 network requests are in effect to provide jwt auth for the browser:

- `app/init`
  - client should provide the expected `id` query param
  - api returns a jwt
- `app/allow-access`
  - client should provide the jwt from the previous request in an authorization header as a bearer value
  - api returns a different jwt
  - client should use this jwt to start the user-login workflow

### Authenticating a user

- `/users/email`
  - client should use the jwt from the previous api
  - client should pass the user's email address as req.body param
- `/users/pw`
  - client should use the same jwt from the previous apis
  - client should pass the user's email address && password as req.body param
  - api returns a new jwt that the client can use throughout the api usage (_per jwt matching user+app criteria etc_)
