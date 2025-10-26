interface IUser {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
