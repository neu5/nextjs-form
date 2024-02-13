export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type GroupsTable = {
  id: string;
  name: string;
  pathname: string;
  date: string;
};

export type PathForm = {
  id: string;
  name: string;
};

export type LeavingHoursPathForm = {
  id: string;
  leaving_hour_id: string;
};

export type PathsField = {
  id: string;
  name: string;
};

export type LeavingHoursTable = {
  id: string;
  value: string;
};

export type LeavingHoursForm = LeavingHoursTable;
