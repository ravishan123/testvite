import { describe, expect, it, vi } from 'vitest';
import { render, screen } from 'testUtils';

beforeAll(() => {
  vi.stubEnv('VITE_USERPOOL_ID', 'test');
  vi.stubEnv('VITE_USERPOOL_WEB_CLIENT_ID', 'test');
  vi.stubEnv('VITE_REGION', 'test');
  vi.stubEnv('VITE_DOMAIN_PREFIX', 'test');

  vi.mock('aws-amplify', () => {
    const mockConfigure = vi.fn();
    const mockListen = vi.fn();

    return {
      Amplify: {
        configure: mockConfigure,
      },
      Hub: {
        listen: mockListen,
      },
    };
  });
});

describe('Pages', () => {
  it('Maintenance page is Visible', async () => {
    const { default: Maintenance } = await import('@pages/Maintenance');
    render(<Maintenance />);
    const element = screen.getByText(/^We will be back in$/i);
    expect(element).toBeInTheDocument();
  });
});

afterAll(() => {
  vi.unstubAllEnvs();
});
