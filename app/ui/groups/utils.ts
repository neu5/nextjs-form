const MAX_MEMBERS_NUM = 4;

let memberId = 0;

const getMemberId = () => {
  memberId += 1;
  return `member-${memberId}`;
};

const getMemberDefault = () => ({
  id: getMemberId(),
  birthdayDate: '',
  PTTKCardNumber: '',
  chefGroupId: '',
  name: '',
  shirtType: '',
  shirtSize: '',
  transportId: '',
  transportLeavingHourId: '',
  guardianName: '',
  isGuardian: '',
  isAdult: false,
});

const getGroupDefault = () => ({
  name: '',
  pathId: '',
  leavingHourId: '',
  submittingPersonEmail: '',
  chefGroupPhoneNumber: '',
  isInstitution: '',
  remarks: '',
  termsAndConditions: '',
  rodo: '',
  members: [getMemberDefault()],
});

export { MAX_MEMBERS_NUM, getMemberDefault, getGroupDefault, getMemberId };
