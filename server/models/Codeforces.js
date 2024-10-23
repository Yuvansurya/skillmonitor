const mongoose = require('mongoose')

const codeforces =  new mongoose.Schema({
    rollno: {
        type: Number,
        unique: true
    }, 
    rating: {
        type: Number,
        default: 0
    }
    
})

module.exports = mongoose.model('Codeforces',codeforces)