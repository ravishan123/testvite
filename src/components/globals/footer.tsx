import { Box } from '@ui/layout';
import { Link, Typography } from '@ui/typography';
import { styled } from '@ui/theme';
import { getRoute } from '@utils/configs/routesConfig';

const StyledBox = styled(Box)(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.grey[100]}`,
  paddingBottom: theme.spacing(0.5),
  paddingTop: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: 'block',
  padding: theme.spacing(0.63, 0),
}));

const footerLinks = [
  {
    label: 'Feedback',
    link: ' https://bit.ly/gudppl-feedback',
  },
  {
    label: 'FAQs',
    link: 'https://help.gudppl.com',
  },
  {
    label: 'gudppl Honour Code',
    link: getRoute('public.honorCode'),
  },
  {
    label: 'Privacy Policy',
    link: getRoute('public.privacyPolicy'),
  },
  {
    label: 'Terms & Conditions',
    link: getRoute('public.privacyPolicy'),
  },
];

export default function Footer() {
  return (
    <Box>
      <StyledBox>
        {footerLinks.map((link) => (
          <StyledLink
            key={link.label}
            href={link.link}
            variant="body1"
            underline="hover"
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
          </StyledLink>
        ))}
      </StyledBox>
      <StyledBox>
        <Typography variant="body1-disabled">2016-{new Date().getFullYear()} gudppl. All rights reserved.</Typography>
      </StyledBox>
    </Box>
  );
}
