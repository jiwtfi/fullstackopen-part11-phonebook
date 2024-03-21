const Filter = ({ keyword, setKeyword }) => {
    return (
        <div>
            filter shown with <input value={keyword} onChange={e => setKeyword(e.target.value)} />
        </div>
    );
};

export default Filter;