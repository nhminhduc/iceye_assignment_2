export type User = {
  user_id: string;
  name: string;
  password?: string; // only returned for own profile
};

export type UserListItem = {
  user_id: string;
  name: string;
};
