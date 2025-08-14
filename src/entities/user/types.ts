export type UserLite = {
  id: number;
  username: string;
  image?: string;
};

export type UsersLiteResponse = {
  users: UserLite[];
};
