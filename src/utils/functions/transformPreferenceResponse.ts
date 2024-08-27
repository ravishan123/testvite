import isEmpty from 'lodash-es/isEmpty';
import { FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query';

import { PreferenceKeys } from '@utils/enums/preference.enum';
import { Preference, PreferenceResponse } from '@utils/types/preference';
import { UserProfileComplete } from '@utils/types/userProfile.type';

function transformPreferenceResponse(
  response: PreferenceResponse,
  _baseQuery: FetchBaseQueryMeta,
  args: UserProfileComplete
) {
  const result = response?.data;
  let isUserProfile = false;

  if (args) {
    isUserProfile = Boolean(args?.about_me && args?.city && args?.country && args?.phone && args?.profile_image);
  }

  const preferenceData = {
    [PreferenceKeys.causes]: result[PreferenceKeys.causes] || [],
    [PreferenceKeys.sdgs]: result[PreferenceKeys.sdgs] || [],
    [PreferenceKeys.skills]: result[PreferenceKeys.skills] || [],
    [PreferenceKeys.languages]: result[PreferenceKeys.languages] || [],
    [PreferenceKeys.availability]: result[PreferenceKeys.availability] || [],
    [PreferenceKeys.remoteAvailability]: result[PreferenceKeys.remoteAvailability] || [],
  };
  const isSkillsAndLanguage =
    !isEmpty(preferenceData[PreferenceKeys.skills]) && !isEmpty(preferenceData[PreferenceKeys.languages]);
  const isAvailability =
    !isEmpty(preferenceData[PreferenceKeys.availability]) &&
    !isEmpty(preferenceData[PreferenceKeys.remoteAvailability]);

  const progressData = {
    [PreferenceKeys.profile]: true,
    [PreferenceKeys.causes]: !isEmpty(preferenceData[PreferenceKeys.causes]),
    [PreferenceKeys.sdgs]: !isEmpty(preferenceData[PreferenceKeys.sdgs]),
    [PreferenceKeys.skillsAndLanguage]: isSkillsAndLanguage,
    [PreferenceKeys.availability]: isAvailability,
    [PreferenceKeys.completeProfile]: isUserProfile,
  };

  const preference: Preference = {
    ...preferenceData,
    progress: progressData,
    info: {
      completedSteps: Object.values(progressData).filter((value) => value).length,
      totalSteps: Object.keys(progressData).length,
    },
  };

  return preference;
}

export { transformPreferenceResponse };
