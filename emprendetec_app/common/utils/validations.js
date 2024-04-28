const emailRequirements = [
  // Domains allowed: tec.ac.cr, itcr.ac.cr, estudiantec.cr
  {
    label: "Correo institucional",
    validate: (email) => (/@((tec\.ac\.cr)|(itcr\.ac\.cr)|(estudiantec\.cr))$/.test(email)),
    onErrorMessage: "El correo debe ser institucional.",
  },
];

/**
 * Validates the email against the same rules as MiCuentaTEC, which are:
 * - Must be an institutional email (tec.ac.cr, itcr.ac.cr, estudiantec.cr)
 * @param {string} email
 * @returns An object with two properties: isValid (boolean) and errors (array of strings)
 */
const validateEmail = (email) => {
  let errorsFound = [];
  emailRequirements.forEach((requirement) => {
    if (!requirement.validate(email)) {
      errorsFound.push(requirement.onErrorMessage);
    }
  });
  const isValid = errorsFound.length === 0;
  return {isValid, errors: errorsFound};
};

const passwordRequirements = [
  {
    label: "Al menos 10 caracteres",
    validate: (password) => (/.{10,}/.test(password)),
    onErrorMessage: "La contraseña debe tener al menos 10 caracteres.",
  },
  {
    label: "Al menos una letra mayúscula",
    validate: (password) => (/[A-Z]/.test(password)),
    onErrorMessage: "La contraseña debe tener al menos una letra mayúscula.",
  },
  {
    label: "Al menos una letra minúscula",
    validate: (password) => (/[a-z]/.test(password)),
    onErrorMessage: "La contraseña debe tener al menos una letra minúscula.",
  },
  {
    label: "Al menos un número",
    validate: (password) => (/\d/.test(password)),
    onErrorMessage: "La contraseña debe tener al menos un número.",
  },
  {
    label: "Al menos un carácter especial",
    validate: (password) => (/[^A-Za-z0-9]/.test(password)),
    onErrorMessage: "La contraseña debe tener al menos un carácter especial.",
  },
  {
    label: "No puede contener =, <, > o !",
    validate: (password) => (/[^=<>!]/.test(password) || !password),
    onErrorMessage:
      "La contraseña no puede contener los caracteres =, <, > o !.",
  },
];

/**
 * Validates the password against the same rules as MiCuentaTEC, which are:
 * - At least 10 characters (Firebase requires at least 6)
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - =<>! not allowed
 * @param {string} password
 * @returns An object with two properties: isValid (boolean) and errors (array of strings)
 */
const validatePassword = (password) => {
  let errorsFound = [];
  passwordRequirements.forEach((requirement) => {
    if (!requirement.validate(password)) {
      errorsFound.push(requirement.onErrorMessage);
    }
  });
  const isValid = errorsFound.length === 0;
  return {isValid, errors: errorsFound};
};

const imageRequirements = [
  {
    label: "Tamaño máximo",
    validate: (file) => file.size <= 1024 * 1024,
    onErrorMessage: "Cada imagen no debe pesar más de 1 MB.",
  },
  {
    label: "Formato de archivo",
    validate: (file) => file.type === "image/jpeg",
    onErrorMessage: "Solo se aceptan imágenes en formato JPEG.",
  },
];

/**
 * Validates the images against specified requirements.
 * - Maximum of 5 images
 * - Each image must be in JPEG format
 * - Each image must be less than 1 MB
 * @param {File[]} files - Array of File objects representing the selected images.
 * @returns An object with two properties: isValid (boolean) and errors (array of strings)
 */
const validateImages = (files) => {
  let errorsFound = [];
  for (let i = 0; i < files.length; i++) {
    imageRequirements.forEach((requirement) => {
      if (!requirement.validate(files[i])) {
        errorsFound.push(requirement.onErrorMessage);
      }
    });
  }
  const isValid = errorsFound.length === 0;
  return { isValid, errors: errorsFound };
};

export { emailRequirements, validateEmail, passwordRequirements, validatePassword, imageRequirements, validateImages};