export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  group_id: string;
};

export type Configuration = {
  is_form_enabled: boolean;
  is_editing_for_users_enabled: boolean;
  is_mailing_enabled: boolean;
  is_ordering_shirts_enabled: boolean;
};

export type GroupsTable = {
  id: string;
  name: string;
  pathname: string;
  creation_datetime: string;
  last_edition_datetime: string;
};

export type GroupForm = {
  id: string;
  name: string;
  type: string;
  date: string;
  path_order: string;
  leavingHours: Array<{ id: string; value: string }>;
};

export type PathsTypes = {
  type: string;
};

export type PathsTable = {
  id: string;
  name: string;
  type: string;
  path_order: string;
  date: string;
};

export type UsersTable = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type OrganizersTable = {
  id: string;
  name: string;
  shirt_size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  shirt_type: 'damska' | 'męska';
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
  path_order: string;
  submitting_person_email: string;
  chef_group_phone_number: string;
  is_institution: boolean;
  leaving_hour_id: string;
  path_id: string;
  member_id: string;
  member_name: string;
  birthday_date: string;
  is_group_chef: boolean;
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
