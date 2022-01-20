const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database conected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomCityNum = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6145133ab6b27107da2f5f4e',
            location: `${cities[randomCityNum].city}, ${cities[randomCityNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
              type: 'Point',
              coordinates: [
                cities[randomCityNum].longitude,
                cities[randomCityNum].latitude
              ]
            },
            images:  [
              {
                url: 'https://res.cloudinary.com/student-elie/image/upload/v1642662669/YelpCamp/aqiymfs6zv5cytos5gvz.jpg',
                filename: 'YelpCamp/aqiymfs6zv5cytos5gvz',
              },
              {
                url: 'https://res.cloudinary.com/student-elie/image/upload/v1642662682/YelpCamp/aivnbah1xwn4v9sz7voq.jpg',
                filename: 'YelpCamp/aivnbah1xwn4v9sz7voq',
              },
              {
                url: 'https://res.cloudinary.com/student-elie/image/upload/v1642662708/YelpCamp/qu5qadwapezt0bmdyzas.jpg',
                filename: 'YelpCamp/qu5qadwapezt0bmdyzas',
              },
              {
                url: 'https://res.cloudinary.com/student-elie/image/upload/v1642662731/YelpCamp/vuezgddgzqsvcvscp3my.jpg',
                filename: 'YelpCamp/vuezgddgzqsvcvscp3my',
              }
            
              ],
            description: 'Using any of the above formats, you can narrow the selection of a random photo even further by supplying a list of comma-separated search terms at the end of the URL.',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});