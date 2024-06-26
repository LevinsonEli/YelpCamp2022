# YelpCamp2022
YelpCamp2022 ([view demo]) - it's a website for people who love campgrounds or just searching a great place to spend holidays.

## Review
On this website you can create, update, delete campgrounds, leave ratings and reviews to the existing and all these without fear that someone else will destroy your changes, because only the one who created campgrounds and reviews have access to delete or edit them.

## Why I did this
This project was a part of "[Web Development Bootcamp][udemyCourse]" by [Colt Steel][udemyColtSteel] on [Udemy][udemy]. The main goal was to create a "real life" project that shows most of the skills that were learned during the course.

## Features
* Full-CRUD manipulations
* Authorization and Authentication
* Protection against nonSQL Injections
* Mongo Atlas Database
* Cloudinary Storage
* Cookies and Sessions
* Flash Messages
* Responsive Design

## Stack of technologies
* NodeJS
* Express
* MongoDB
* EJS
* Bootstrap
* Passport, MongoSanitize, Helmet, Joi, SanitizeHTML, Mongoose, MapBox, MulterCloudinaryStorage and other libraries.

## To Run Locally
So, probably heroku is still trying to load my masterpiece. Another way to see my code alive - is on your machine.
* Load the project and unpackage it or use a ``` git clone ``` command
* You need to have node, npm and mongo installed. If you don't have those yet here you go: [node&npm][nodeLink] | [mongoDB][mongoLink] (or use your mongoDB online)
* Create a Cloudinary account
* Create a .env file and provide the next variables there: CLOUDINARY_CLOUD_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET (that you've got from the cloudinary account)
* Add MONGO_URI variable, if you have a URI for your mondo DB, inside the .env file.
* For using/seeing maps: provide the MAPBOX_TOKEN (it's from the [MapBox library][mapBoxLink])
* Run the following in your bash:
```
npm install
```
to install all the other packages for running the app.
* For running mongoDB locally type in the bash:
```
mongod
```
* Now you can start runing the project:
```
node app.js
```
And [here][localHostLink] you go.



[view demo]: https://yelp-camp-2022.onrender.com/
[herokuLink]: https://yelp-cmp.herokuapp.com/
[nodeLink]: https://nodejs.org/en/download/
[mongoLink]: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
[mapBoxLink]: https://account.mapbox.com/auth/signin/
[localHostLink]: https://localhost:3000/
[udemyCourse]: https://www.udemy.com/course/the-web-developer-bootcamp/
[udemyColtSteel]: https://www.udemy.com/user/coltsteele/
[udemy]: https://www.udemy.com/



