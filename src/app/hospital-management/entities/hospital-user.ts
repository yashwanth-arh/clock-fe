export interface hospitalUser {
  id: number;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  gender: string | null;
  designation: string | null;
  emailId: string | null;
  contactNumber: string | null;
  status: string | null;
}
export interface hospitalUserResponse {
  content?: hospitalUser[];
  pageable?: Pageable;
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
}
export interface hospitalUserDevice {
  version: number;
  last_updated_by: string | null;
  imei_number: string | null;
  last_updated_at: string | null;
  vendor_name: string | null;
  device_data_mode: string | null;
  device_model_no: string | null;
  connectivity: string | null;
  assign_status: string | null;
}

export interface hospitalUserResponseDevice {
  content?: hospitalUserDevice[];
  pageable?: Pageable;
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
}

export interface Pageable {
  sort: Sortable;
  pageNumber: number;
  pageSize: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface Sortable {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
