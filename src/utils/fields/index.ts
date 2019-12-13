/*eslint-disable no-console*/

const fieldValidation = {
  isValidEmail: _email,
  isValidPhone: _phone,
  isValidPassword: _password,
  isValidMode: _mode
};
export default fieldValidation;

function _email(email: any) {
  console.log('email', email);
  let is_valid = false;
  console.log("#################################");

  if (email !== 'undefined' && email) {
    is_valid = true;
  }
  return is_valid;
}

function _phone(phone: any) {
  console.log("#################################");

  let is_valid = false;
  if (phone !== 'undefined' && phone) {
    is_valid = true;
  }
  return is_valid;
}

function _password(pass: any) {
  console.log("#################################");

  let is_valid = false;
  if (pass !== 'undefined' && pass) {
    is_valid = true;
  }
  return is_valid;
}

function _mode(mode: any) {
  console.log("#################################");

  let is_valid = false;
  if (mode !== 'undefined' && mode) {
    is_valid = true;
  }
  return is_valid;
}