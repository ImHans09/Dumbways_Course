import parsePhoneNumber from 'libphonenumber-js';

function validatePhoneNumber(phoneNumber) {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
  const validation = parsedPhoneNumber && parsedPhoneNumber.isValid();

  return validation
}

function truncateString(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

export { 
  validatePhoneNumber, 
  truncateString 
};