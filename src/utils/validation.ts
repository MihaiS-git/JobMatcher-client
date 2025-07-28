export function validateEmail(email: string): string | null {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return "Email is required.";
  }
  const emailRegex =
    /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  const trimmedPassword = password.trim();

  const hasLowercase = /[a-z]/.test(trimmedPassword);
  const hasUppercase = /[A-Z]/.test(trimmedPassword);
  const hasNumber = /\d/.test(trimmedPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
    trimmedPassword
  );
  const isLongEnough = trimmedPassword.length >= 10;

  if (!trimmedPassword) {
    return "Password is required.";
  }
  if (!isLongEnough) {
    return "Password must be at least 10 characters.";
  }
  if (!hasLowercase) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!hasUppercase) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!hasNumber) {
    return "Password must contain at least one digit.";
  }
  if (!hasSpecial) {
    return "Password must contain at least one special character.";
  }
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword.trim()) {
    return "Confirm password is required.";
  }
  if (password.trim() !== confirmPassword.trim()) {
    return "Passwords must match.";
  }
  return null;
}

export function validateName(name: string): string | null {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/;

  if (!name.trim()) {
    return "Name field is required.";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters long.";
  }

  if (!nameRegex.test(name)) {
    return "Name must be at least 2 characters and contain only letters, spaces, hyphens or apostrophes.";
  }
  return null;
}

export function validatePhone(phone: string): string | null {
  const trimmedPhone = phone.trim();

  const phoneRegex =
    /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

  if (!trimmedPhone) {
    return "Phone is required.";
  }
  if (!phoneRegex.test(trimmedPhone)) {
    return "Invalid phone number format.";
  }

  return null;
}

export function validatePostalCode(postalCode: string): string | null {
  const trimmed = postalCode.trim();

  if (!trimmed) {
    return "Postal code is required.";
  }

  // Generic: at least 4 characters, alphanumeric, allows space or dash
  const postalRegex = /^[A-Za-z0-9][A-Za-z0-9\s-]{3,}$/;

  if (!postalRegex.test(trimmed)) {
    return "Invalid postal code format.";
  }

  return null;
}

export function validateStreet(street: string): string | null {
  const trimmed = street.trim();

  if (!trimmed) {
    return "Street is required.";
  }

  // Minimum length check
  if (trimmed.length < 3) {
    return "Street must be at least 3 characters long.";
  }

  // Only allow letters, numbers, commas, dots, dashes and spaces
  const streetRegex = /^[A-Za-z0-9șȘțȚăĂâÂîÎéè.,\- ]+$/u;

  if (!streetRegex.test(trimmed)) {
    return "Street contains invalid characters.";
  }

  return null;
}

export function validateImageFile(file: File) {
  const allowedTypes = [
    "image/tiff",
    "image/bmp",
    "image/avif",
    "image/gif",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const allowedExtensions = [
    ".tiff",
    ".bmp",
    ".avif",
    ".gif",
    ".jpeg",
    ".jpg",
    ".png",
    ".webp",
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return "Unsupported file extension. Allowed: tiff, bmp, avif, gif, jpeg, jpg, png, webp";
  }

  if (!allowedTypes.includes(file.type)) {
    return "Unsupported media format. Allowed: tiff, bmp, avif, gif, jpeg, jpg, png, webp";
  }

  if (file.size > maxSize) {
    return "File size must be less than 10MB.";
  }

  return null;
}
