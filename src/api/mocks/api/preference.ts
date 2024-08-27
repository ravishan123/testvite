import { rest, RestHandler } from 'msw';
import { Api } from '@utils/functions/apiEndpointFactory';

const handlers: RestHandler[] = [];

if (Api.endpoints.preference?.root) {
  handlers.push(
    rest.get(Api.endpoints.preference.root, (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          data: {
            userSdgs: [
              '060b90d6-f2c3-48e9-990a-8fdede359667',
              '2ee49531-1957-4306-9f46-a0fe03f4c5d5',
              'd908391a-77e8-45c8-96c8-4158aab06576',
            ],
            userSkills: ['1713699e-9c28-4778-aea5-9994488141a0'],
            userCauses: ['99fef02e-be7c-41c0-8958-c56f4d20cfae'],
            userLanguages: [
              {
                user_read: false,
                user_type: false,
                languageId: '96d22830-712d-4dc1-aabf-99bc93610f45',
                user_speak: false,
                user_write: false,
              },
              {
                user_read: false,
                user_type: true,
                languageId: '30b8c7bc-5b1b-4e4d-84df-2401291a3c97',
                user_speak: false,
                user_write: false,
              },
              {
                user_read: false,
                user_type: true,
                languageId: 'd9e0c4b0-ce4c-4818-8c63-1c2de327eed5',
                user_speak: false,
                user_write: false,
              },
            ],
            dailyAvailability: [
              {
                evening: false,
                morning: false,
                weekday: 'FRIDAY',
                afternoon: true,
              },
              {
                evening: false,
                morning: false,
                weekday: 'THURSDAY',
                afternoon: true,
              },
              {
                evening: false,
                morning: true,
                weekday: 'WEDNESDAY',
                afternoon: false,
              },
            ],
            remoteAvailability: {
              remoteAvailability: true,
            },
          },
        })
      );
    })
  );
}

export default handlers;
