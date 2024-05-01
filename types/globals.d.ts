import { Timestamp } from "firebase/firestore";
import {
  MouseEventHandler,
  ChangeEvent,
  MouseEvent,
  HTMLInputElement,
} from "react";

export {};

declare global {
  ChangeEvent;

  interface HTMLInputEvent extends ChangeEvent<HTMLInputElement> {}
  /**
   * Component Prop Types
   */
  interface PostItemProps {
    id: string;
    datePosted: Timestamp;
    thumbnailURL: string;
    title: string;
  }

  interface TagButtonProps {
    tag: string;
    active?: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
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
    imageURL?: string;
    alt?: string;
    caption?: string;
  }

  interface Comment {
    datePosted: string;
    author: string;
    content: string;
  }

  interface BlogPostData {
    id: string;
    title: string;
    thumbnailURL: string;
    tag: string;
    spotify: string;
    date: "single" | "range";
    startDate: Timestamp;
    endDate?: Timestamp;
    datePosted: Timestamp;
    content: Content[];
  }

  interface BlogPostPreview {
    id: string;
    title: string;
    tag: string;
    datePosted: Timestamp;
    thumbnailURL: string;
    preview: string;
  }

  // Post Upload Types
  interface TempImageContent {
    type: "image";
    id: string;
    tempImageFile: Blob;
    alt: string;
    caption: string;
  }

  interface Form {
    id: string;
    title: string;
    thumbnail: Blob;
    tag: string;
    spotify: string;
    startDate: string;
    endDate?: string;
    content: any[];
  }

  interface FormError {
    id?: string;
    title?: string;
    thumbnail?: string;
    tag?: string;
    spotify?: string;
    date?: string;
    content?: string;
  }

  interface FirestoreUsersQuery {
    id?: string;
  }

  interface FirestoreBlogPostPreviewQuery {
    id?: string;
    tag?: string;
    order?: "asc" | "desc";
  }
}
