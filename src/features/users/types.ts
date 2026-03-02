export interface User {
  user_id: string;
  name: string;
  password?: string; // only returned for own profile
}

export interface UserListItem {
  user_id: string;
  name: string;
}
