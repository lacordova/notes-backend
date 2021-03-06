const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

beforeEach(async () => {
    await Note.deleteMany({})

    let newObj = new Note(helper.initialNotes[0])
    await newObj.save()

    newObj = new Note(helper.initialNotes[1])
    await newObj.save()
})

test('notes are returned as json', async () => {
  await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')
  
  expect(response.body).toHaveLength(helper.initialNotes.length)
})

test('a  specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const content = response.body.map(note => note.content)

  expect(content).toContain('Browser can execute only Javascript')
})

test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }
  await api
    .post('/api/notes')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  const content = notesAtEnd.map(note => note.content)

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)
  expect(content).toContain('async/await simplifies making async calls')
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)  

})

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

  expect(resultNote.body).toEqual(processedNoteToView)
})

test('note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const removedNote = notesAtStart[0]
  
  await api
    .delete(`/api/notes/${removedNote.id}`)
    .expect(204)
  
  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1)

  const content = notesAtEnd.map(note => note.content)
  expect(content).not.toContain(removedNote.content)

})

afterAll(() => {
    mongoose.connection.close()
})