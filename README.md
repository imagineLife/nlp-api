# NLP-API
This hopes to cover some [Natural Language Processing](https://en.wikipedia.org/wiki/Natural_language_processing) use-cases through a rest api.  
This is intended to start as a presidential-inaugural-address collection, with some nlp processing applied to the speech text.  


## Use A MongoDB Backend
This is expected to connect to a [mongodb](https://www.mongodb.com/) data store.  

## Run With Docker
Setup some env vars: i think for now i'd recommend `your.env` file.  
```env
MONGO_AUTH=false
MONGO_DB_HOST=<your-mongo-hostname>
MONGO_DB_PORT=<your-mongo-port>
MONGO_DB_USER=<your-db-username>
MONGO_DB_PW=<your-db-pw>
```
