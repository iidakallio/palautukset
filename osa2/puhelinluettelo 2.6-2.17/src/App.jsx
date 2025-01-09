import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    if (persons.find(person => person.name === newName)) {
      if(window.confirm(`${newName} is already added to phonebook. Replace the old number with a new one?`)) {
        const foundPerson = persons.find(person => person.name === newName)
        const changedPerson = { ...foundPerson, number: newNumber }

        personService
          .update(foundPerson.id, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== foundPerson.id ? person : returnedPerson
              )
            )
            setNewName('')
            setNewNumber('')
            setErrorMessage(`Number for ${newName} was replaced with new one`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.error(error)
            setErrorMessage(
              `Information of '${newName}' has already been deleted from server`
            )
            setPersons(persons.filter(n => n.id !== id))
            return;
          })
          
          
      }
      return;
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
  
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      setErrorMessage(`${personObject.name} was added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
  
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        setErrorMessage(`${name} was deleted`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
  }
  
  const personsToShow = filter ? persons.filter(person => 
      person.name.toLowerCase().includes(filter.toLowerCase())): persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter filter={filter}  handleFilterChange={handleFilterChange}/>
      <h2>add a new</h2>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        addPerson={addPerson} 
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson}/>
    </div>
  )

}

export default App