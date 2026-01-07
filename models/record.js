const mongoose = require('mongoose')

const recordSchema = new mongoose.Schema({
    itemName: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    vehicleno: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    source: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    destination: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    amount: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    qty: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    date: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    time: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    addedby: {
        username: String
    }

})


module.exports = mongoose.model('records', recordSchema)