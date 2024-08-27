import { Badge, BadgeProps } from '@ui/badge';

export default function NotificationBadge(props: BadgeProps) {
  return <Badge color="error" badgeContent="1" max={999} {...props} />;
}
