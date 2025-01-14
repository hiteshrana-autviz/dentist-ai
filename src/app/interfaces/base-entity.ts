export interface BaseEntity {
    id: string; // ObjectId field from MongoDB
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
  }
  