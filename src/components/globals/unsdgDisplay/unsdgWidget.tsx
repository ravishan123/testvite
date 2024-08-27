import ActionWidgetCard from '@globals/actionWidgetCard';
import { Typography } from '@ui/typography';
import { Box } from '@ui/layout';

import ListUnsdg from './listUnsdg';

type UnsdgWidgetProps = {
  sdgs?: string[];
  onEditUnsdgClick?: () => void;
  isLoading?: boolean;
  disableActionButtons?: boolean;
  isActionsVisible?: boolean;
};

/**
 * Renders a widget displaying the selected United Nations Sustainable Development Goals.
 * @param {Object} props - The component props.
 * @param {Array} props.sdgs - The selected SDGs.
 * @param {Function} props.onEditUnsdgClick - The function to handle the click event on the "Edit UN SDG's" button.
 * @returns {JSX.Element} - The UnsdgWidget component.
 */
export default function UnsdgWidget({
  disableActionButtons = false,
  sdgs,
  onEditUnsdgClick = () => undefined,
  isLoading = false,
  isActionsVisible = true,
}: UnsdgWidgetProps) {
  return (
    <ActionWidgetCard
      isEmpty={!sdgs?.length}
      title="United Nations Sustainable Development Goals"
      actionTitle="Edit UNSDGs"
      onActionClick={onEditUnsdgClick}
      disableActionButtons={disableActionButtons}
      isActionsVisible={isActionsVisible}
    >
      <ListUnsdg
        disableActionButtons={false}
        selected={sdgs || []}
        tileSize={36}
        spacing={1 / 2}
        isSelectionLoading={isLoading}
      />
      {sdgs && sdgs?.length <= 0 && !isActionsVisible && !isLoading ? (
        <Box textAlign="center">
          <Typography textAlign="center" variant="body1-secondary">
            No information has been added yet
          </Typography>
        </Box>
      ) : (
        ''
      )}
    </ActionWidgetCard>
  );
}
