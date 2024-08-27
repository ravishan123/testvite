import { RestHandler } from 'msw';
import preferenceHandlers from './api/preference';
import settingsHandlers from './api/settings';
import volunteerHandlers from './api/volunteer';

export const handlers: RestHandler[] = [...preferenceHandlers, ...settingsHandlers, ...volunteerHandlers];
