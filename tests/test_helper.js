const Note = require('../models/note')

const initialNotes = [
    {
      content: 'HTML is easy',
      date: new Date(),
      important: false
    },
    {
      content: 'Browser can execute only Javascript',
      date: new Date(),
      important: true
    }
]

const nonExistingId = async () => {
    const nonExistingNote = new Note({
        content: 'this content will be remove',
        important: true
    })
    await nonExistingNote.save()
    await nonExistingNote.remove()
    
    return nonExistingNote._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

module.exports = {
    initialNotes,
    nonExistingId,
    notesInDb
}