import fieldValidations from './fields';

const validator = {
  validateEmail: _validateEmail,
  validateLogin: _validate_login
};
export default validator;

function _validateEmail(inputEmail: string) {
  const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (inputEmail.match(emailFormat)) {
    return true;
  }
  return false;
}

function _validate_login(loginModel: any) {
  const { email, phone, password, mode } = loginModel;

  let is_valid_bool = false;

  //TODO: Check for better email validation
  const is_valid_email_bool = fieldValidations.isValidEmail(email);
  const is_valid_phone_bool = fieldValidations.isValidPhone(phone);
  const is_valid_password_bool = fieldValidations.isValidPassword(password);
  const is_valid_mode_bool = fieldValidations.isValidMode(mode);

  console.log('data validity', 'email', is_valid_email_bool, 'phone', is_valid_phone_bool, 'password', is_valid_password_bool, 'mode', is_valid_mode_bool);

  if ((is_valid_email_bool || is_valid_phone_bool) && is_valid_password_bool && is_valid_mode_bool) {
    is_valid_bool = true;
  }
  return is_valid_bool;
}