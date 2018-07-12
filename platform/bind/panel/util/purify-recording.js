module.exports = recording => {
  let cache = [];
  return JSON.parse(JSON.stringify(recording, (key, value) => {
    if (key == 'subject') return;
    if (typeof value === 'object' && value != null) {
      if (cache.includes(value)) return "_referenced earlier_";
      else cache.push(value);
    }

    return value;
  }));
}
