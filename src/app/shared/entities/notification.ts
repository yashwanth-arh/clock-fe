import { Pageable } from "src/app/settings-management/entities/disease";


export interface Notification {
  id: string;
  description: string;
  notifyTo: string;
  createdTime: string;
  seen: boolean;
}


export interface NotificationResponse {
  content?: Notification[];
  totalElements?: number;
  numberOfElements?: number;
  pageable?: Pageable
}


export interface NotificationCount {
  notificationCount: number
}
