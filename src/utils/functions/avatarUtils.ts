function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    color: stringToColor(name),
    text: `${name.split(' ')[0][0]?.toUpperCase()}${name.split(' ')[1][0]?.toUpperCase()}`,
  };
}

/**
 * Returns the URL of an organization's logo given its ID.
 * @param logoId - The ID of the organization's logo.
 * @returns The URL of the organization's logo.
 */
function getOrganizationLogo(logoId: string) {
  return logoId
    ? [
        'https://',
        import.meta.env.VITE_ORGANIZATION_RESOURCE_BUCKET as string,
        import.meta.env.VITE_S3_URL as string,
        logoId,
      ].join('')
    : '';
}
function getProfileLogo(logoId: string) {
  return logoId
    ? [
        'https://',
        import.meta.env.VITE_USER_PROFILE_RESOURCE_BUCKET as string,
        import.meta.env.VITE_S3_URL as string,
        logoId,
      ].join('')
    : '';
}

export { stringToColor, stringAvatar, getOrganizationLogo, getProfileLogo };
