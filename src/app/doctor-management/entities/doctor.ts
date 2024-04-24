
export interface Doctor {
  address: {
    city: string | null;
    state: string | null;
    addressLine: string | null
  };
  branch: {
    id: string | null
  };
  contactNumber: string | null;
  docNPI: string | null;
  locNPI: string | null;
  name: string | null;
  hospital: {
    id: string | null
  };
  userStatus: string | null;
}

export interface DoctorResponse {
  content?: Doctor[];
  totalElements?: number;
  numberOfElements?: number;

}
