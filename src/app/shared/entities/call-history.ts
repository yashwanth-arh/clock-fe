import { Pageable } from 'src/app/hospital-management/entities/hospital';

export type callStatus = 'INITIATED' | 'COMPLETED' | 'CANCELLED' | 'WAITING';

export interface CallHistory {
	roomName?: string;
	sender?: string;
	reciever?: string;
	senderCallDuration?: string;
	recieverCallDuration?: string;
	typeOfCall?: string;
	patientName?: string;
	status?: callStatus;
}

export interface CallHistoryResponse {
	content?: CallHistory[];
	pageable?: Pageable;
	totalPages?: number;
	totalElements?: number;
	numberOfElements?: number;
}
