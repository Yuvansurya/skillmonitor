const mongoose = require('mongoose')

const userSchema =  new mongoose.Schema({
    rollno: {
        type: Number,
        unique: true
    }, 
    password: {
        type: String
    },
    name: {
        type: String
    }, 
    year: {
        type: String
    },
    dept: {
        type: String
    },
    codechef: {
        type: String
    },
    codeforces: {
        type: String
    },
    leetcode: {
        type: String
    },
    cf_rating: {
        type: Number,
        default: 0
    },
    cf_max_rating: {
        type: Number,
        default: 0
    },
    cf_rank:{
        type: String,
        default: ''
    },
    lc_constestattended: {
        type: Number,
        default: 0
    },
    lc_rating: {
        type: Number,
        default: 0
    },
    lc_toppercentage: {
        type: Number,
        default: 0
    },
    lc_rank: {
        type: Number,
        default: 0
    },
    cc_rating: {
        type: Number,
        default: 0
    },
    cc_maxrating: {
        type: Number,
        default: 0
    },
    cc_star: {
        type: String,
        default: 0
    }
})

module.exports = mongoose.model('User',userSchema)