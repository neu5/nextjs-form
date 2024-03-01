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
  type: string;
  date: string;
  leavingHours: Array<{ id: string; value: string }>;
};

export type PathsTypes = {
  type: string;
};

export type PathsTable = {
  id: string;
  name: string;
  type: string;
  date: string;
};

export type TransportsTable = {
  id: string;
  name: string;
};

export type TransportForm = {
  id: string;
  name: string;
};

export type LeavingHoursTransportForm = {
  id: string;
  transport_id: string;
  leaving_hour_id: string;
};

export type PathForm = {
  id: string;
  name: string;
  type: string;
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
  type: string;
};

export type ShirtsSizesList = {
  size: string;
};

export type LeavingHoursForm = LeavingHoursTable;

export type ValueOf<T> = T[keyof T];
