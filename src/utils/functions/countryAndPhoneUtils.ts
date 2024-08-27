import { phoneCodes } from '@utils/data/countries.data';

export function stripPhoneNo(phoneNo: string) {
  const code = phoneCodes.find((code) => phoneNo.startsWith(code));
  let number = phoneNo;

  if (code) {
    number = number.replace(code, '').trim();
  }

  return { code, number };
}
