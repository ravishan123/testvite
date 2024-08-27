export interface UNSDG {
  id: string;
  name: string;
}

export type UserUNSDG = string[];

export type UserUNSDGResponse = {
  data: { data: UserUNSDG };
  message?: string;
};
