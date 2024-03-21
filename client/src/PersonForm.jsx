import { useState } from 'react';

const PersonForm = ({ add }) => {
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');

    return (
        <form>
            <div>
                name: <input value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div>number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} /></div>
            <div>
                <button type="submit" onClick={e => {
                    e.preventDefault();
                    if (add({ name: newName, number: newNumber })) {
                        setNewName('');
                        setNewNumber('');
                    }
                }}>add</button>
            </div>
        </form>
    );
};

export default PersonForm;