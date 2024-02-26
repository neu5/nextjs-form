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
  datetime: string;
};

export type GroupForm = {
  id: string;
  name: string;
  date: string;
  leavingHours: Array<{ id: string; value: string }>;
};

export type PathsTable = {
  id: string;
  name: string;
  date: string;
};

export type PathForm = {
  id: string;
  name: string;
};

export type LeavingHoursPathForm = {
  id: string;
  path_id: string;
  leaving_hour_id: string;
};

export type PathsField = {
  id: string;
  name: string;
  date: string;
  leavingHours: Array<LeavingHoursForm>;
};

export type LeavingHoursTable = {
  id: string;
  value: string;
  is_deleted: boolean;
};

export type ShirtsTypesList = {
  id: string;
  value: string;
};

export type ShirtsSizesList = ShirtsTypesList;

export type LeavingHoursForm = LeavingHoursTable;

export type ValueOf<T> = T[keyof T];
