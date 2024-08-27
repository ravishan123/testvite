import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import isEqual from 'lodash-es/isEqual';

import { useFetchUnsdgQuery } from '@store/slices/settings/settings.slice';

import { Grid, Box } from '@ui/layout';
import { Typography } from '@ui/typography';
import { Button } from '@ui/button';
import { SelectedIcon } from '@ui/icons/SelectedIcon';
import { UnselectedIcon } from '@ui/icons/UnselectedIcon';
import { Skeleton } from '@ui/skeleton';

import { NetworkStatus } from '@globals/networkStatus';

import UnsdgTitle from './unsdgTile';

type ListUnsdgProps = {
  selected?: string[];
  spacing?: number;
  tileSize?: number;
  selectable?: boolean;
  isShowSelectAll?: boolean;
  onChange?: (selected: string[]) => void;
  isSelectionLoading?: boolean;
  skeletonLength?: number;
  disableActionButtons?: boolean;
  hasMax?: boolean;
  limit?: number;
};

export default forwardRef(function ListUnsdg(
  {
    selected = [],
    spacing = 1,
    tileSize,
    onChange,
    selectable = false,
    isShowSelectAll = false,
    isSelectionLoading = false,
    skeletonLength = 10,
    hasMax = false,
    limit = 0,
  }: ListUnsdgProps,
  ref
) {
  const [selection, setSelection] = useState<string[]>(selected);
  const { data: items = [], isError, isFetching, error } = useFetchUnsdgQuery(undefined);

  const handleOnChange = (id: string) => {
    if (hasMax && selection.length >= limit && !selection.includes(id)) {
      setSelection([...selection]);
      return;
    }
    const newSelection = [...selection];
    const itemIndex = newSelection.indexOf(id);

    if (itemIndex === -1) {
      newSelection.push(id);
    } else {
      newSelection.splice(itemIndex, 1);
    }

    setSelection(newSelection);

    if (onChange) {
      onChange(newSelection);
    }
  };

  const handleSelectAll = () => {
    let newSelection: string[] = [];

    if (items.length && selection.length !== items.length) {
      newSelection = [...items.map((item) => item.id)];
    }

    setSelection(newSelection);

    if (onChange) {
      onChange(newSelection);
    }
  };

  useEffect(() => {
    if (!isEqual(selection, selected)) {
      setSelection(selected);
    }
  }, [selected]);

  useImperativeHandle(ref, () => ({
    selectAll: handleSelectAll,
  }));

  return (
    <Box>
      <Grid container columnSpacing={spacing} rowSpacing={spacing}>
        <NetworkStatus
          isError={isError}
          error={error && 'error' in error ? error.error : 'Error loading UN SDGs'}
          loadingText="Loading UN SDGs..."
        />
        {(isFetching || isSelectionLoading) &&
          Array.from({ length: skeletonLength }).map((_, index) => (
            <Grid item key={`unsdg-list${index}`} display="inline-flex">
              <Skeleton variant="rounded" width={tileSize} height={tileSize} />
            </Grid>
          ))}
        {!isFetching &&
          !isSelectionLoading &&
          items.map((item) =>
            selectable || (!selectable && selection.includes(item?.id)) ? (
              <Grid item key={`unsdg-list${item?.id}`} display="inline-flex">
                <UnsdgTitle
                  index={item?.index}
                  id={item?.id}
                  label={item?.label}
                  tileSize={tileSize}
                  selected={selectable ? selection.includes(item?.id) : true}
                  selectable={selectable}
                  onChange={handleOnChange}
                  // disabled={hasMax && selection.length >= limit && !selection.includes(item?.id)}
                />
              </Grid>
            ) : null
          )}
      </Grid>
      {!isFetching && !isSelectionLoading && isShowSelectAll && selectable && (
        <Button variant="custom-compact" color="primary" sx={{ mt: 2 }} onClick={handleSelectAll}>
          <Grid item display="flex" alignItems="center" spacing={1}>
            <Box width="25px" height="25px" mr={0.5}>
              {selection.length === items.length ? <SelectedIcon /> : <UnselectedIcon />}
            </Box>
            <Box>
              <Typography>Select all</Typography>
            </Box>
          </Grid>
        </Button>
      )}
    </Box>
  );
});
