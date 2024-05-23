import { Timestamp } from "firebase/firestore";
import {
  MouseEventHandler,
  ChangeEvent,
  MouseEvent,
  HTMLInputElement,
} from "react";

export {};

declare global {
  interface HTMLInputEvent extends ChangeEvent<HTMLInputElement> {}
  /**
   * Component Prop Types
   */

  interface PostPreviewSkeletonProps {
    id: number;
  }

  interface PostPreviewProps {
    id: string;
    datePosted: Timestamp;
    thumbnailURL: string;
    title: string;
    preview: string;
    index: number;
  }

  interface TagButtonProps {
    tag: string;
    active?: boolean;
    href: string;
  }

  interface ImageModalProps {
    open: boolean;
    handleClose: () => void;
    handleAddContent: (content: TextContent | TempImageContent) => void;
  }

  interface TextModalProps {
    open: boolean;
    handleClose: () => void;
    handleAddContent: (content: TextContent | TempImageContent) => void;
  }

  /**
   * Generic Types
   */

  type Content = TextContent | ImageContent;

  interface TextContent {
    type: "text";
    id: string;
    text: string;
  }

  interface ImageContent {
    type: "image";
    id: string;
    imageURL: string;
    alt: string;
    caption?: string;
  }

  interface CommentData {
    id: string;
    comments: Comment[];
  }

  interface Comment {
    datePosted: Timestamp;
    author: string;
    content: string;
  }

  interface BlogPostData {
    id: string;
    title: string;
    thumbnailURL: string;
    tag: string;
    spotify: string;
    dateType: "single" | "range";
    startDate: Timestamp;
    endDate?: Timestamp;
    datePosted: Timestamp;
    content: Content[];
    preview: string;
  }

  interface BlogPostPreview {
    id: string;
    title: string;
    tag: string;
    datePosted: Timestamp;
    thumbnailURL: string;
    preview: string;
  }

  /**
   * Post Edit Types
   */

  type FormEditContent = TempImageEditContent | TextContent;

  interface FormEdit {
    id: string;
    title: string;
    thumbnail: Blob;
    tag: string;
    spotify: string;
    startDate: string;
    endDate?: string;
    content: FormEditContent[];
    preview: string;
  }

  /**
   * Post Edit Types
   */
  interface TempImageContent {
    type: "image";
    id: string;
    tempImageFile: Blob;
    alt: string;
    caption?: string;
  }

  interface TempImageEditContent {
    type: "image";
    id: string;
    imageURL?: string;
    tempImageFile?: Blob;
    alt: string;
    caption?: string;
  }

  type FormContent = TempImageContent | TextContent;

  interface Form {
    id: string;
    title: string;
    thumbnail: Blob;
    tag: string;
    spotify: string;
    startDate: string;
    endDate?: string;
    content: FormContent[];
    preview: string;
  }

  interface FormError {
    id?: string;
    title?: string;
    thumbnail?: string;
    tag?: string;
    spotify?: string;
    date?: string;
    content?: string;
    preview?: string;
  }

  // Firestore Queries

  interface FirestoreUsersQuery {
    id?: string;
  }

  interface FirestoreBlogPostPreviewQuery {
    id?: string;
    tag?: string;
    order?: "asc" | "desc";
  }

  interface FirestoreBlogPostCommentsQuery {
    id: string;
  }

  // Email List
  interface EmailUser {
    name: string;
    email: string;
  }
}
