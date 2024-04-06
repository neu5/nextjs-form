// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    name: 'Kuba',
    email: 'neus90@gmail.com',
    password: '',
    role: 'admin',
  },
  {
    name: 'Testowy',
    email: 'emeryktest@gmail.com',
    password: '',
    role: 'user',
  },
];

const configuration = [
  {
    is_form_enabled: false,
    is_editing_for_users_enabled: false,
    is_mailing_enabled: false,
    is_ordering_shirts_enabled: false,
  },
];

const leavingHours = [
  {
    value: '5:00',
  },
  {
    value: '6:00',
  },
  {
    value: '7:00',
  },
  {
    value: '20:00',
  },
  {
    value: '20:15',
  },
  {
    value: '20:30',
  },
  {
    value: '20:45',
  },
  {
    value: '21:00',
  },
  {
    value: '21:15',
  },
  {
    value: '21:30',
  },
  {
    value: '21:45',
  },
  {
    value: '22:00',
  },
];

const pathsTypes = ['piesza', 'rowerowa'];

const shirtsTypes = ['damska', 'męska'];

const shirtsSizes = ['S', 'M', 'L', 'XL', 'XXL'];

module.exports = {
  configuration,
  users,
  leavingHours,
  pathsTypes,
  shirtsTypes,
  shirtsSizes,
};
