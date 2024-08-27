import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';
import { Button } from '@ui/button';
import { ChevronRightIcon } from '@ui/icons';

import ContentContainer from '@globals/contentContainer';

type ActionWidgetCardProps = {
  title: string;
  children: React.ReactNode;
  actionTitle: string;
  onActionClick: () => void;
  isEmpty?: boolean;
  disableActionButtons?: boolean;
  isActionsVisible?: boolean;
};

/**
 * Renders a card with a title, children, and an action button.
 * @param title - The title of the card.
 * @param actionTitle - The title of the action button.
 * @param children - The children to render inside the card.
 * @param onActionClick - The function to call when the action button is clicked.
 * @param isEmpty - Whether the card is empty or not.
 * @returns The rendered ActionWidgetCard component.
 */
export default function ActionWidgetCard({
  title,
  actionTitle,
  children,
  isEmpty = false,
  onActionClick,
  disableActionButtons,
  isActionsVisible = true,
}: ActionWidgetCardProps) {
  return (
    <ContentContainer size={[2, 2, isEmpty ? 2 : 0.5, 2]}>
      <Box mb={2} sx={{ textAlign: isEmpty ? 'center' : 'left' }}>
        <Typography variant="h5">{title}</Typography>
      </Box>
      <Box mb={!isActionsVisible ? 1 : 0}>{children}</Box>
      {isActionsVisible && (
        <Box display="flex" justifyContent={isEmpty ? 'center' : 'space-between'} alignItems="center" mt={1}>
          {!disableActionButtons && (
            <Button
              variant="outlined"
              color="primary"
              onClick={onActionClick}
              {...(!isEmpty && {
                endIcon: <ChevronRightIcon />,
                fullWidth: true,
                variant: 'custom',
                sx: { mx: -1, width: 'calc(100% + 32px)', pl: 1, pr: 0 },
              })}
            >
              {isEmpty ? 'Add' : actionTitle}
            </Button>
          )}
        </Box>
      )}
    </ContentContainer>
  );
}
