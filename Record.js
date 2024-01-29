require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URL)
    .then(result => {
        console.log("Connected to MongoDB")
    })
    .catch(error => {
        console.log("ERROR:", error)
    })

const recordSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minLength: [3, "Too few words for name. It should be atleast greater than or equal to 3 words."]
        },
    number: {
        type: String,
        unique: true,
        minLength: [9, "A phone number must have length of 8 or more"],
        validate: {
            validator: (value) => {
                return /(\s|^)(\d{2}|\d{3})(-\d{5,})/gm.test(value);
            },
            message: (props) => {
                return `${props.value} is not valid number. Format should be either DD-DDDDDD+ or DDD-DDDDD+.`}
    }
    },
    important: Boolean
})

recordSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id
        delete returnedObject.__v
    }
})

recordSchema.set('toObject', {
    transform: (document, returnedObject) => {
        returnedObject._id = returnedObject._id.toString()
        delete returnedObject.__v
    }
})

const Record = new mongoose.model('Record', recordSchema)

module.exports = Record