export const applyfilter = (items, variableObj) => {
  try {
    const { variableName, ordering } = variableObj;
    if (variableName === 'price') {
      if (ordering === 'ascending') {
        const sorted = items.sort((a, b) => (parseInt(a.price, 10) > parseInt(b.price, 10) ? 1 : -1));
        return sorted;
      }
      const sorted = items.sort((a, b) => (parseInt(a.price, 10) > parseInt(b.price, 10) ? -1 : 1));
      return sorted;
    }

    if (variableName === 'rating') {
      const sorted = items.sort((a, b) => (parseInt(a.rating.rate, 10) > parseInt(b.rating.rate, 10) ? -1 : 1));
      return sorted;
    }
    return items;
  } catch (err) {
    console.log(err);
    return items;
  }
};
