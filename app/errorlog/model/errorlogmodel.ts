
export class ErrorLogging {
    constructor(
      public _id : number = 0 ,
      public username : string = '',
      public emailAddress:string = '',
      public phoneNumber:string = '',
      public errorCode:string = '',
      public timeStamp: Date = null,
      public errorDetailedDesc :string = '',
      public errorDesc: string = '',
      public firstName: string = '',
      public lastName: string = '',
      public encryptedTaxId: string = '',
    ){

    }
}
