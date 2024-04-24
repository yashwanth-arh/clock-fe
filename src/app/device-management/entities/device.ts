export interface Device {
  'id'?: number;
  'deviceVersion'?: string | null;
  'deviceCode'?: string | null;
  'deviceType': string | null;
  'vendorName': string | null;
  'manufacturedDate': Date | null;
  'price': string | null;
  'status': string | null;
  'assignStatus': string | null;
}

export interface DeviceResponse {
  content?: Device[];
  totalElements?: number;
  numberOfElements?: number;
}
