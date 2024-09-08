const mongoose = require('mongoose');

const aliasSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: { // New field for storing the image URL
        type: String,
        required: false // Not required, in case some users don't have an image
    },
    isFavorite: {
        type: Boolean,
        default: false,
        required: false
    },
   currency: {
         
            type: String,
            required : true
    },
    amount: {
        type: Number,
        required : true
    }
});

const Alias = mongoose.model('Alias', aliasSchema);

module.exports = Alias;
