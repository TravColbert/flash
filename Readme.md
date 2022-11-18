# Flash 

## Developing Locally

The easiest way to get started developing your app locally is:

### Create a .env file with local-only settings

Copy ```.env.sample``` to ```.env``` and make editions matching your setup.

### Start a Local Node Instance 

```
nvm use stable
npm i
npm start
```

### Start a Local Docker Build

First build an image like this:

```
docker build .
```

Then run:

```
docker run --env-file .env -p 3000:3000 -it your_app_container_name
```
