const Person = ({ filteredPersons, remove }) => {
    return (
        <div>
            {filteredPersons.map(({ id, name, number }) => (
                <div key={name}>
                    {name} {number} <button onClick={() => remove({ id, name })}>delete</button>
                </div>
            ))}
        </div>
    );
};

export default Person;