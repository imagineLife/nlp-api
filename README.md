# NLP-API

This hopes to cover some [Natural Language Processing](https://en.wikipedia.org/wiki/Natural_language_processing) use-cases through a rest api.  
This is intended to start as a presidential-inaugural-address collection, with some nlp processing applied to the speech text.

- [NLP-API](#nlp-api)
  - [Use A MongoDB Backend](#use-a-mongodb-backend)
  - [Run With Docker](#run-with-docker)
  - [Getting Data Into The DB](#getting-data-into-the-db)
  - [Authentication](#authentication)

## Use A MongoDB Backend

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

Get a client id.  
Use the client id to allow-access for that client for the duration of the client's use.  
Register as a user: create an account using an email + pw. Registe r&/or login to use the api.
