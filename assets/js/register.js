import parsePhoneNumber from 'libphonenumber-js';
export { validatePhoneNumber };

function validatePhoneNumber(phoneNumber) {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
  const validation = parsedPhoneNumber && parsedPhoneNumber.isValid();

  return validation
}