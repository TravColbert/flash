# Flash 

## Configuring

There are 3 ways to configure your app:

 1. .env file
 1. config.file
 1. container/cloud environment

### .env file

**.env** files are intended to be used for local development. They are gitignored to prevent them from being included in your Git repo.

**dotenv** is used to parse the **.env** files and include them into node's **process.env** object.

### config.file

The NPM **config** package is also used to support config files. name your config files **development** or **production** so the right oen is used depending on your app's stage of development. 

The **config/** folder is *not* protected by gitignore to be careful about what you put in these files. 

Config files overwrite environment variables set either through a local .env file or your cloud environment. 

### Container or cloud environment variables

The best way to configure your app is to use your cloud provider's environment.

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

You might find that adding the **--rm** argument prevents Docker complaints.
 
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
