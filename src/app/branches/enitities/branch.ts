export interface Branch {
  'id': string | null;
  'name': string | null;
  'emailId': string | null;
  'primaryContactNumber': string | null;
  'emergencyContactNumber': string | null;
  'address': {
    'addressLine': string | null,
    'city': string | null,
    'state': string | null,
    'zipCode': number
  };
  'branchType': string | null;
  'hospital': {
    'id': string | null,
    'name': string | null,
    'emailId': string | null,
    'contactNumber': string | null,
    'status': string | null,
    'address': null,
    'practiceNPI': string | null,
    'noOfBranches': number
  };
  'status': string | null;
}

export interface BranchResponse {
  content?: Branch[];
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
