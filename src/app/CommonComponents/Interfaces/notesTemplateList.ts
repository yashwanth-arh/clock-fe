export interface NotesList {
    "ptNoteId"?: string | null;
    "patientId"?: string | null;
    "patientName"?: string | null;
    "senderId"?: string | null;
    "senderName"?: string | null;
    "receiverId"?: string | null;
    "receiverName"?: string | null;
    "flag"?: string | null;
    "eShared"?: number | null;
    "templateFlag"?: boolean | null;
    "description"?: string | null;
    "createdOn"?: string | null;
    "updatedOn"?: string | null;
}

export interface TemplateList {
    "createdBy"?: string | null;
    "createdById"?: string | null;
    "createdDate"?: string | null;
    "defaultNoteId"?: string | null;
    "description"?: string | null;
    "patientId"?: string | null;
    "updatedBy"?: string | null
}