export interface TotalPatients {
    "firstName": string | null;
    "lastName": string | null;
    "userStatus": string | null;
    "address": Address;
    "gender": string | null;
    "phoneCode": string | null;
    "middleName": string | null;
    "id": string | null;
    "age": number,
    "cellNumber": string | null;
    "personalEmail": string | null;

}

export interface PatientResponse {
    content?: TotalPatients[];
    totalElements?: number;
    numberOfElements?: number;
  }
  
export interface Address {
    "addressLine"?: string | null;
    "city"?: string | null;
    "state"?: string | null;
    "country"?: string | null;
    "zipCode"?: number;
}