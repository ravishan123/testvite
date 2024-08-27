import ActionWidgetCard from '@globals/actionWidgetCard';
import causeList from '@utils/constants/causes.const';
import { Box } from '@ui/layout';
import { Typography } from '@ui/typography';

import ListCauses from './listCauses';

type CausesWidgetProps = {
  causes?: string[];
  onEditCausesClick?: () => void;
  isLoading?: boolean;
  disableActionButtons?: boolean;
  sort?: boolean;
  isActionsVisible?: boolean;
};

export default function CausesWidget({
  causes,
  onEditCausesClick = () => undefined,
  isLoading = false,
  disableActionButtons = false,
  sort = false,
  isActionsVisible = true,
}: CausesWidgetProps) {
  const sortCauses = () => {
    if (!sort) {
      return causes;
    }
    const causeObj = causes?.map((cause) => {
      return causeList[cause];
    });
    const sortedCause = causeObj?.sort((a, b) => a.name.localeCompare(b.name));
    return sortedCause?.map((cause) => cause.id) || [];
  };

  return (
    <ActionWidgetCard
      isEmpty={!causes?.length}
      title="Causes we care about"
      actionTitle="Edit causes"
      onActionClick={onEditCausesClick}
      disableActionButtons={disableActionButtons}
      isActionsVisible={isActionsVisible}
    >
      <ListCauses
        items={sortCauses() || []}
        tileSize={36}
        spacing={1 / 2}
        isLoading={isLoading}
        borderRadius="6px"
        invert
      />
      {causes && causes?.length <= 0 && !isActionsVisible && !isLoading ? (
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
