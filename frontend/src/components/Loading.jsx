function Loading({ message = 'Загрузка...' }) {
  return (
    <div className="loading">
      <div className="flex items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Loading;
