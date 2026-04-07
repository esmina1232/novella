function Alert({ type, message, onClose }) {
  const classes = {
    success: 'alert success',
    error: 'alert error',
    info: 'alert'
  };

  return (
    <div className={classes[type] || classes.info}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 text-lg">&times;</button>
      )}
    </div>
  );
}

export default Alert;
