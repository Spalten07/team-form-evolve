// Format phone numbers to Swedish format: 000 000 00 00
export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return "";
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format to 000 000 00 00
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }
  
  // Return original if not 10 digits
  return phone;
};
