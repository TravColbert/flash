# Flash 

## Local Build

Copy ```.env.sample``` to ```.env``` and make editions matching your setup.

```
docker build .
```

## Local Run

```
docker run --env-file .env -p 3000:3000 -it your_app_container_name
```
