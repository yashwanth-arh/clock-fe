
export interface Notification {
   id?: string | null;
   description?: string | null;
   notifyTo?: string | null;
   createdTime?: string | null;
   seen?: boolean;
}

export interface NotificationResponse {
content?: Notification[];
totalElements?: number;
numberOfElements?: number;
}


