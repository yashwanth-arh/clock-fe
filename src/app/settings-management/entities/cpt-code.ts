export interface CptCode {
  'id'?: string;
  'name': string;
  'description'?: string;
  'code'?: string;
  'amount'?: number;
  'status'?: Status;
}


export interface CptResponse {
  content?: CptCode[];
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


export interface Listing {
  name: string;
  id: string;
}

export interface CptListing {
  cptcodeList: Listing[];
}


export enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}
