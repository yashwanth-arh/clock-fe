
export interface Ticket {
adminCanClose ?: boolean;
closedBy?: string | null;
description?: string  | null;
id ?: string  | null;
patient?: string  | null;
requestedDate?: string  | null;
status?: string  | null;
title?: string  | null;
}

export interface TicketResponse {
	content?: Ticket[];
	totalElements?: number;
	numberOfElements?: number;
}


