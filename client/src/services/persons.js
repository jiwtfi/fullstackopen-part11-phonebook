import axios from 'axios';
// const baseUrl = 'http://localhost:3001/api/persons';
const baseUrl = '/api/persons';

const getAll = () => axios.get(baseUrl);

const create = person => axios.post(baseUrl, person);

const update = person => axios.put(`${baseUrl}/${person.id}`, person);

const remove = id => axios.delete(`${baseUrl}/${id}`);

const personService = { getAll, create, update, remove };

export default personService;