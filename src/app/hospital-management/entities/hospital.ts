export interface Hospital {
  'name'?: string | null;
  'description'?: string | null;
  'emailId'?: string | null;
  'contactNumber'?: string | null;
  'address'?: {
    'state': string | null,
    'city': string | null,
    'addressLine': string | null,
    'zipCode': string|null
  };
  'status'?: string | null;
}

export interface HospitalResponse {
  content?: Hospital[];
  pageable?: Pageable;
  totalPages?: number;
  totalElements?: number;
  numberOfElements?: number;
}


export interface Pageable {
  'sort': Sortable;
  'pageNumber': number;
  'pageSize': number;
  'offset': number;
  'unpaged': boolean;
  'paged': boolean;
}


export interface Sortable {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
