import React, { useState } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import useNotes from './hooks/useNotes'
import { useUser } from './hooks/useUser'

const Notes = () => {
  const { notes, addNote, toggleImportanceOf } = useNotes()
  const { user, logout, login } = useUser()
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const toggleImportanceOfNote = (id) => {
    toggleImportanceOf(id) // El que viene del custom hook
      .catch(() => {
        setErrorMessage('Note was already removed from server')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const handleLogout = () => {
    logout()
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      login({ username, password })
      setUsername('')
      setPassword('')
    } catch (err) {
      setErrorMessage('Wrong Credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {
				user
				  ? <NoteForm addNote={addNote} handleLogout={handleLogout} />
				  : <LoginForm
    username={username} password={password}
    handleUsernameChange={
                                ({ target }) => setUsername(target.value)
                              }
    handlePasswordChange={
                                ({ target }) => setPassword(target.value)
                              }
    handleSubmit={handleLogin}
				    />
			}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note, i) =>
          <Note
            key={i}
            note={note}
            toggleImportance={() => toggleImportanceOfNote(note.id)}
          />
        )}
      </ul>

    </div>
  )
}

export default Notes
