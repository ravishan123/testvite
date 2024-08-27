type GetSetType = {
  contextParam: string;
  locationType: 'preference' | 'orgEdit';
};
const orgEditSteps = {
  stepOne: { id: 0, fields: ['orgname', 'orgtype', 'socialenterprise'] },
  stepTwo: { id: 1, fields: ['aboutorg', 'phonenumber', 'location', 'causes', 'unsdg'] },
  stepThree: { id: 2, fields: ['profilepicture', 'orgsize', 'weblink', 'sociallink'] },
};
const preferenceSteps = {
  stepOne: { id: 0, fields: ['firstname', 'lastname', 'dateofbirth', 'gender'] },
  stepTwo: { id: 1, fields: ['causes'] },
  stepThree: { id: 2, fields: ['unsdg'] },
  stepFour: { id: 3, fields: ['skills', 'languages'] },
  stepFive: { id: 4, fields: ['availability'] },
  stepSix: { id: 5, fields: ['profilepicture', 'phonenumber', 'location', 'aboutme'] },
};

const getStep = ({ contextParam, locationType }: GetSetType) => {
  for (const { id, fields } of Object.values(
    locationType === 'orgEdit' ? orgEditSteps : locationType === 'preference' ? preferenceSteps : {}
  )) {
    if (fields.includes(contextParam.toLowerCase())) {
      return id;
    }
  }
  return 0;
};

export { getStep };
