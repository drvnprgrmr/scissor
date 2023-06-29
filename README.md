# Scissor
An application to make working with and handling links easier. 


## Features

### URL Shortening:
Scissor allows you to take a long URL and create a shortened `alias` that when  accessed as a path on the platform, redirects you to your original URL.

### Custom Aliases:
Scissor also allows you to customize the `alias` generated. Users can choose a custom `alias` that reflects their brand or content. \
This is particularly useful for individuals or small businesses who want to create branded links for their operations. 

### QR Code Generation:
Scissor automatically generates a QR Code image for every shortened `alias`. \
Users can download the QR code image and use it in their promotional materials and/or on their website. 

### Link History:
Scissor allows you to see the history of `alias`'s you’ve created so you can easily find and reuse them.

### Analytics:
Scissor provides basic analytics that allows you to track your `alias`'s performance. \
Users can see how many clicks and scans their `alias`'s has received. \
Analytics are provided on each `hit` where a hit is a click or scan.

These are the details of each `hit`: 

- Date and time of the `hit`
- IP address of `hit`
- Referrer (this is the name of the website the link was clicked from)
- Location (country and city) of `hit`
- Internet Service Provider of the `hit`


## Running the project locally

### Set up your database
You can create a new collection on [MongoDB Atlas](https://www.mongodb.com/atlas/database)  \
Or you can also install [MongoDB](https://www.mongodb.com/docs/manual/installation/) and make sure it's running locally

### Set up redis
If you use a unix/linux system (i.e. Ubuntu or Mac systems) you can just install Redis and run it locally. \
If you're on the Windows spectrum though you will have to use a [managed Redis Server](https://geekflare.com/redis-hosting-platform/). I suggest [Redis Labs](https://redis.com/redis-enterprise-cloud/overview/) though as it's the official one.

### Set up .env
After your mongodb and redis are setup you can rename the `.env.sample` file to `.env` and put in appropriate values for the variables. \
Here's how the `.env.sample` looks like currently:
```bash
MONGODB_URI="MONGODB_URI"
SESSION_SECRET="SESSION_SECRET"

REDIS_PASSWORD="REDIS_PASSWORD"
REDIS_HOST="REDIS_HOST"
REDIS_PORT="REDIS_PORT"
```
Put in the appropriate fields from your services (MongoDB and Redis) and add an appropriate session secret.

### Install packages and run the server
Make sure you have [NodeJS](https://nodejs.org/en/download) installed and type in `npm install` in the terminal of your root directory. \
After that, type in `node ./dist/index.js` and you should get something like this in your terminal:
<br />
![image](https://github.com/drvnprgrmr/scissor/assets/67306305/9ecf60be-c92d-4177-8722-ee6dc3c8f7f2)

This means your app is running locally and you can access it on http://localhost:8080
