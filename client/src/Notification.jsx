const Notification = ({ feedback: { message, isError } }) => {
    return (
        <div className={`message ${isError ? 'error' : 'success'}`}>
            {message}
        </div>
    );
};

export default Notification;