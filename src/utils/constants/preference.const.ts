import { PreferenceKeys } from '@utils/enums/preference.enum';
import { PreferenceDefinition } from '@utils/types/preference';

export const preferenceDefinition: PreferenceDefinition = {
  [PreferenceKeys.causes]: {
    label: 'Causes you care about',
  },
  [PreferenceKeys.sdgs]: {
    label: 'United Nations Sustainable Development Goals',
  },
  [PreferenceKeys.skillsAndLanguage]: {
    label: 'Your skills & talents',
  },
  [PreferenceKeys.availability]: {
    label: 'Availability to volunteer',
  },
  [PreferenceKeys.profile]: {
    label: 'Profile Information',
  },
  [PreferenceKeys.completeProfile]: {
    label: 'Complete your profile',
  },
};
