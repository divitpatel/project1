export class LoggedInUserInfo {
  userId: string;
  userType: string;
  emailAddress: string;
  accessLevel: string;
  userFirstName: string;
  userLastName: string;
  producer: {
    primaryAccount: string,
    type: string,
    phoneNumber: string,
    emailAddress: string,
    encryptedTaxId: string,
    agencyName: string,
    appointedStates: string[],
    lineOfBusiness: {}
  };
}
