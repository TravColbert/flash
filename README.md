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

The above initializes your database and tables, but does not populate the database with any seed data. If you want to do that then:

```
npm run with-seed
```

### Start a Local Docker Build

This will run Node in PRODUCTION mode.

First build an image like this:

```
docker build -t _your_app_name_:latest .
```

For example: 

```
docker build -t flash-test:latest .
```

will build an image tagged as flash-test.

Then run:

```
docker run -it --env-file .env -p 3000:3000 --name _your_app_name_ _image_name_
```

For example:

```
docker run -it --env-file .env -p 3000:3000 --name flash-test-app flash-test
```

Above, we call the container **flash-test-app**. This has a writable filesystem such that your database entries will persist between restarts of your container.
#### Restarting a container

Below would (re)start your container, preserving your app's state (database entries) exactly where you left off.

```
docker start flash-test-app
```

Adding an **-i** makes the container 'interactive', allowing you to see the server's log output on-screen.

```
docker start -i flash-test-app
```
