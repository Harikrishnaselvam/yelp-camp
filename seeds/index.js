const path = require('path')
const mongoose = require('mongoose')
const cities = require('./cities')
const Campground = require('../views/models/campground')
const {descriptors,places} = require('./seedhelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser:true,
    //useCreateIndex:true,
    //useFindAndModify:true,
    useUnifiedTopology:true
})


db = mongoose.connection;
db.on("error", console.error.bind(console, "connection ERROR"));
db.once("open", ()=>{
    console.log("Database connection open")
})

const sample = array => array[Math.floor(Math.random() * array.length )]

const seedDB =  async()=>{
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random()*20)*10
        const camp = new Campground({
            author:'63dbcd28bd0379985929400c',
            location: `${cities[random1000].city}, ${cities[random1000].state} `, 
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
              
                {
                    url: 'https://res.cloudinary.com/dtb2psdfl/image/upload/v1679806003/YelpCamp/gdknsoijfkhzrsqvjwqg.jpg',
                    filename: 'YelpCamp/gdknsoijfkhzrsqvjwqg'
                 
                },
                {
                    url: 'https://res.cloudinary.com/dtb2psdfl/image/upload/v1679806002/YelpCamp/zphwametg42320vjh5am.jpg',
                    filename: 'YelpCamp/zphwametg42320vjh5am'
                    
                }
              ],
            description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Delectus labore magnam reiciendis ex corrupti, nobis, obcaecati alias laboriosam voluptatum, cumque dignissimos accusamus? Voluptatibus accusamus voluptatum nulla vel doloribus, delectus voluptatem?",
            price
            })
            await camp.save()
        }
}

seedDB().then(()=>{
    mongoose.connection.close();
})