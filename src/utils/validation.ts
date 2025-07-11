export function validateEmail(email: string): string | null {
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    return "Email is required.";
  }
  const emailRegex = /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
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
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(trimmedPassword);
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

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if(!confirmPassword.trim()){
    return "Confirm password is required."
  }
  if(password.trim() !== confirmPassword.trim()){
    return "Passwords must match."
  }
  return null;
}

export function validateName(name: string): string | null {
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/;

  if(!name.trim()){
    return "Name field is required."
  }

  if(name.trim().length < 2){
    return "Name must be at least 2 characters long."
  }

  if(!nameRegex.test(name)){
    return "Name must be at least 2 characters and contain only letters, spaces, hyphens or apostrophes."
  }
  return null;
}