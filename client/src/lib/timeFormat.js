const timeFormat = (time) => {
  const date = new Date(time);

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default timeFormat;