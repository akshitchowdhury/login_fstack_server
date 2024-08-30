const mongoose = require('mongoose');

const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb+srv://devAshura:bfynbMfuvGgpdMf7@cluster0.tzqkmvn.mongodb.net/", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
      
          });
          console.log('Connected to MongoDB');
        } catch (error) {
          console.log('Error connecting to MongoDB:', error);
        }
}

module.exports = connectDB;