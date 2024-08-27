import { rest, RestHandler } from 'msw';
import { Api } from '@utils/functions/apiEndpointFactory';

const handlers: RestHandler[] = [];

if (Api.endpoints.volunteer?.hours) {
  handlers.push(
    rest.get(Api.endpoints.volunteer.hours, (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          message: 'Data Successfully Retrieved.',
          data: [
            {
              id: '5a406fdd-a9d5-4f56-bf91-786f99e80717',
              organizationName: 'ABC organization',
              organizationId: null,
              status: 'PENDING',
              hours: '23:30',
              city: 'colombo',
              country: 'colombo',
              startDate: '2023-09-23T00:00:00.000Z',
              endDate: '2023-09-23T00:00:00.000Z',
              activityDescription: 'Abc description',
              createdAt: '2023-09-24T09:26:00.540Z',
              logo: null,
            },
            {
              id: 'b9b84e6c-80fa-4757-878a-1f4d3d9a6672',
              organizationName: 'ABC organization',
              organizationId: null,
              status: 'PENDING',
              hours: '23:30',
              city: 'colombo',
              country: 'colombo',
              startDate: '2023-09-23T00:00:00.000Z',
              endDate: '2023-09-23T00:00:00.000Z',
              activityDescription: 'Abc description',
              createdAt: '2023-09-24T09:27:07.081Z',
              logo: null,
            },
            {
              id: 'e694e6e4-aaa9-458a-9943-06d6041d11bd',
              organizationName: 'ABC organization',
              organizationId: null,
              status: 'PENDING',
              hours: '23:59',
              city: 'colombo',
              country: 'colombo',
              startDate: '2023-09-23T00:00:00.000Z',
              endDate: '2023-09-23T00:00:00.000Z',
              activityDescription: 'Abc description',
              createdAt: '2023-09-24T09:27:13.682Z',
              logo: null,
            },
            {
              id: 'd12c7d80-3609-4984-a2fb-b0fd758d254e',
              organizationName: 'ABC organization',
              organizationId: null,
              status: 'PENDING',
              hours: '23:00',
              city: 'colombo',
              country: 'colombo',
              startDate: '2023-09-23T00:00:00.000Z',
              endDate: '2023-09-23T00:00:00.000Z',
              activityDescription: 'Abc description',
              createdAt: '2023-09-25T17:41:47.618Z',
              logo: null,
            },
          ],
        })
      );
    })
  );
}

export default handlers;
