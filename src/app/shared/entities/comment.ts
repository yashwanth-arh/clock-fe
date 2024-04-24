import { Doctor } from 'src/app/doctor-management/entities/doctor';

export interface Comment {
  id?: string;
  text: string;
  category?: string;
  savedBy?: Doctor | null;
  givenBy?: CommentUserRelation;
  givenTo?: CommentUserRelation;
  defaultComment?: boolean;
}


export interface CommentUserRelation {
  id: string;
}


