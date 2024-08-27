import { PreferenceKeys } from '@utils/enums/preference.enum';
import { Languages } from './languages.type';
import { Availability, RemoteAvailability } from './availability.type';

export type PreferenceResponse = {
  data: {
    [PreferenceKeys.causes]: string[];
    [PreferenceKeys.sdgs]: string[];
    [PreferenceKeys.skills]: string[];
    [PreferenceKeys.languages]: Languages[];
    [PreferenceKeys.availability]: Availability[];
    [PreferenceKeys.remoteAvailability]: RemoteAvailability;
  };
};

export type PreferenceSetupProgressKeys = Exclude<
  PreferenceKeys,
  PreferenceKeys.skills | PreferenceKeys.languages | PreferenceKeys.remoteAvailability
>;

export type Preference = {
  [PreferenceKeys.causes]: string[];
  [PreferenceKeys.sdgs]: string[];
  [PreferenceKeys.skills]: string[];
  [PreferenceKeys.languages]: Languages[];
  [PreferenceKeys.availability]: Availability[];
  [PreferenceKeys.remoteAvailability]: RemoteAvailability;
  progress: {
    [k in PreferenceSetupProgressKeys]: boolean;
  };
  info: {
    completedSteps: number;
    totalSteps: number;
  };
};

export type PreferenceDefinition = {
  [k in PreferenceSetupProgressKeys]: {
    label: string;
  };
};
