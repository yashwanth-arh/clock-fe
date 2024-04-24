
export interface Caregiver {
  address: string
  branch: string
  contactNo: string | null;
  name: string | null;
  hospital: string
  userStatus: string | null;
}  
  
export interface CaregiverResponse {
  content?: Caregiver[];
  totalElements?: number;
  numberOfElements?: number;

}