export interface Disease {
  id?: string;
  icdName: string;
  description: string;
  icdCode: string;
  status?: string;
}

export interface DiseaseResponse {
  content?: Disease[];
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

export interface DiseaseDropDownList {
  diseaseList: Listing[];
}


export interface IcdCodeDropDownList {
  icdCodes: Listing[];
}
