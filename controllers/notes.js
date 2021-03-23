const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const handleGetNotes = async (req,res)=>{
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })      
  res.json(notes)
}

const handleNotesId = async (req, res) => {
  const id = req.params.id
  const note = await Note.findById(id)
  if(note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
}
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

const handlePostNotes = async (req,res) => {
  const body = req.body
  const token = getTokenFrom(req)

  const decodedToken = jwt.verify(token, process.env.SECRET)
  console.log('decoded token --->   ', decodedToken)

  const user = await User.findById(decodedToken.id)
    
  const newNote = new Note({
    content : body.content,
    date : new Date(),
    important : body.important || false,
    user: user._id
  })

  const savedNote = await newNote.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  res.json(savedNote)
}

const handleDeleteNotes = async (req,res) => {
  const id = req.params.id
  await Note.findByIdAndRemove(id)
  res.status(204).end()  
}

const handleUpdateNote = async (req, res) => {
  const id = req.params.id
  const body = req.body
  const newNote = {
    content: body.content,
    important: body.important
  }
  const noteUpdate = await Note.findByIdAndUpdate(id, newNote, {new: true})
  res.json(noteUpdate)
}

notesRouter.get('/',handleGetNotes)
notesRouter.get('/:id',handleNotesId)
notesRouter.post('/',handlePostNotes)
notesRouter.delete('/:id',handleDeleteNotes)
notesRouter.put('/:id', handleUpdateNote)

module.exports = notesRouter