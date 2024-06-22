import { useEffect, useState } from 'react'
import personService from './services/persons';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import Notification from './Notification';
import './index.css';

const initFeedback = { message: '', isError: false };

const App = () => {
  const [persons, setPersons] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [feedback, setFeedback] = useState(initFeedback);

  const triggerNotification = ({ message, isError }) => {
    setFeedback({ message, isError: isError ?? false });
    setTimeout(() => { setFeedback(initFeedback) }, 3000);
  };

  const handleNotFound = ({ id, name }) => {
    triggerNotification({ message: `Information of ${name} has already been removed from server`, isError: true });
    setPersons(persons => persons.filter(person => person.id !== id));
  };

  const add = ({ name, number }) => {
    const person = { name: name.trim(), number: number.trim() };
    if (person.name.length === 0 || person.number.length === 0) return;
    const foundPerson = persons.find(({ name }) => name === person.name);
    if (foundPerson) {
      const confirmed = window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`);
      if (!confirmed) return false;
      person.id = foundPerson.id;
      return personService
        .update(person)
        .then(({ data }) => {
          setPersons(persons => ([...persons.filter(({ id }) => id !== foundPerson.id), data]));
          triggerNotification({ message: `Updated ${name}` });
          return true;
        }).catch(err => {
          if (err.response.status === 404) handleNotFound(person);
          else triggerNotification({ message: err.response.data.error, isError: true });
          return false;
        });
    }
    return personService
      .create(person)
      .then(({ data }) => {
        setPersons(persons => ([...persons, data]));
        triggerNotification({ message: `Added ${name}` });
        return true;
      }).catch(err => {
        triggerNotification({ message: err.response.data.error, isError: true });
      });
  };

  const remove = ({ id, name }) => {
    const confirmed = window.confirm(`Delete ${name}?`);
    if (!confirmed) return;
    personService
      .remove(id)
      .then(() => {
        setPersons(persons => persons.filter(person => person.id !== id));
        triggerNotification({ message: `Deleted ${name}` });
      }).catch(() => {
        handleNotFound({ id, name });
      });
  };

  useEffect(() => {
    personService
      .getAll()
      .then(({ data }) => {
        setPersons(data);
      });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      {feedback.message ? <Notification feedback={feedback} /> : null}
      <Filter keyword={keyword} setKeyword={setKeyword} />
      <h3>add a new</h3>
      <PersonForm add={add} />
      <h3>Numbers</h3>
      <Persons
        filteredPersons={persons.filter(({ name }) => (
          name.toLowerCase().includes(keyword.trim().toLowerCase()))
        )}
        remove={remove}
      />
    </div>
  );
}

export default App;