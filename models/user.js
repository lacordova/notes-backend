const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new  mongoose.Schema({
  username: {
    type: String,
    unique: true},
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
})
    
userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.userId = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)