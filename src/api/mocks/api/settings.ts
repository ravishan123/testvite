import { rest, RestHandler } from 'msw';
import { Api } from '@utils/functions/apiEndpointFactory';

const handlers: RestHandler[] = [];

if (Api.endpoints.settings?.root) {
  handlers.push(
    rest.get(Api.endpoints.settings.organizationTypes as string, (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          data: [
            {
              id: '2461118e-90f4-42a7-9cb4-e864931fe9ab',
              orgtype: 'Community group',
              description: 'Association, club/society, or community group',
            },
            {
              id: '79194a5a-2b5a-4690-aa61-3dda00a8ad26',
              orgtype: 'Business',
              description: 'Small/medium business, company, or multi-national company',
            },
            {
              id: 'e7a621f7-513e-495e-853b-498ca5449222',
              orgtype: 'Non-profit',
              description: 'Charity, non-profit, NGO, foundation, charitable trust, or religious organisation',
            },
            {
              id: 'fd8b71f5-8ab7-436d-8306-0b0668c18c4c',
              orgtype: 'Educational institution',
              description: 'School, college, university, or trade school',
            },
            {
              id: '9803f528-1e14-40af-8a46-373414078c4a',
              orgtype: 'Government',
              description: 'Municipality, local authority, govt. agency, state/provincial, or national',
            },
          ],
        })
      );
    })
  );
}

export default handlers;
