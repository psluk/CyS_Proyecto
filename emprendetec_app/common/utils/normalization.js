const normalizeString = (string) => {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/\s+/g, " ").trim().toLowerCase();
};

export { normalizeString };