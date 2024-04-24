export interface UserProfile {
  address: {
    addressLine: string,
    city: string,
    state: string;
    zipCode: number;
  };
  cellNumber: string; city: string;contactNumber: string;homeNumber: string;name: string;firstName: string;
  lastName: string;middleName: string; npi: number;hospitalName: string;profileImage: Image;clinicName: string;
}
export interface Image {
  image: string;
  fileName: string;
  memeType: string;
}
export interface UserProfileResponse {
  userProfile: UserProfile;
}