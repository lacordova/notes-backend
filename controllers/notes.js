const notesRouter = require('express').Router()
const Note = require('../models/note')

const handleGetNotes = (req,res)=>{
    Note.find({}).then(notes => {
      res.json(notes)
    })
}

const handleNotesId = (req, res, next) => {
    const id = req.params.id
    Note.findById(id)
      .then(note => {
        if(note) {
          res.json(note)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => next(err))
  
}

const handlePostNotes = (req,res,next) => {
    const body = req.body
    
    const newNote = new Note({
      content : body.content,
      date : new Date(),
      important : body.important || false
    })
  
    newNote.save()
      .then(savedNote => {
      res.json(savedNote)
    })
      .catch(err => next(err))
}

const handleDeleteNotes = (req,res,next) => {
    const id = req.params.id
    Note.findByIdAndRemove(id)
      .then(()=> {
        res.status(204).end()
      })
      .catch(err => next(err))
  
    
}

const handleUpdateNote = (req, res, next) => {
    const id = req.params.id
    const body = req.body
  
    const newNote = {
      content: body.content,
      important: body.important
    }
  
    Note.findByIdAndUpdate(id, newNote, {new: true})
      .then(updateNote => {
        res.json(updateNote)
      })
      .catch(err=> next(err))
  
}

notesRouter.get('/',handleGetNotes)
notesRouter.get('/:id',handleNotesId)
notesRouter.post('/',handlePostNotes)
notesRouter.delete('/:id',handleDeleteNotes)
notesRouter.put('/:id', handleUpdateNote)

module.exports = notesRouter