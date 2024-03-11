const capitalize = (text: string | undefined) => {
  if (!text) {
    return text;
  }

  return text[0].toUpperCase() + text.slice(1).toLowerCase();
};

export default capitalize;
