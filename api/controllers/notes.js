const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const authorization = require('../middleware/authorization')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
    _id: 0
  })
  response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
  const { id } = request.params

  Note.findById(id).then(note => {
    return note
      ? response.json(note)
      : response.status(404).end()
  }).catch(next)
})

notesRouter.delete('/:id', authorization, async (request, response, next) => {
  const { id } = request.params
  try {
    const result = await Note.findByIdAndDelete(id)
    if (result === null) return response.sendStatus(400)

    response.status(204).end()
  } catch (err) {
    next(err)
  }
})

notesRouter.put('/:id', authorization, (request, response, next) => {
  const { id } = request.params
  const note = request.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then(result => {
    response.json(result)
  }).catch(next)
})

notesRouter.post('/', authorization, async (request, response, next) => {
  try {
    const { content, important = false } = request.body
    const { userId } = request
    const user = await User.findById(userId)

    if (!content) {
      return response.status(400).json({
        error: 'required "content" field is missing'
      })
    }

    const newNote = new Note({
      content: content,
      date: new Date(),
      important,
      user: user._id
    })
    const savedNote = await newNote.save()

    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
  } catch (err) {
    next(err)
  }
})

module.exports = notesRouter
