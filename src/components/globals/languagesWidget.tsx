import React, { useEffect, useState } from 'react';
import some from 'lodash-es/some';
import ActionWidgetCard from '@globals/actionWidgetCard';
import { useAtom } from 'jotai';
import { Grid, Box } from '@ui/layout';
import { Typography } from '@ui/typography';
import { storeLanguagesAtom } from '@serverAtoms/preferences/languages/storeLanguages.atom';
import { Skeleton } from '@ui/skeleton';

type LanguagesWidgetProps = {
  onEditClick?: () => void;
};

type Abilities = {
  speak: boolean;
  read: boolean;
  write: boolean;
  type: boolean;
};

type Language = {
  id: string;
  name: string;
  abilities: Abilities;
};

const LanguagesWidget: React.FC<LanguagesWidgetProps> = ({ onEditClick = () => undefined }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [languagesAtom] = useAtom(storeLanguagesAtom);
  let language = languagesAtom?.data?.data as Language[] | undefined;

  language =
    language &&
    language
      .filter((value) => some(value?.abilities, (value) => value === true))
      .sort((a, b) => a.name.localeCompare(b.name));
  useEffect(() => {
    setIsLoading(languagesAtom?.isLoading);
  }, [languagesAtom?.isLoading]);

  const generateAbilitiesText = (abilities: Abilities) => {
    const abilitiesText = [];

    if (abilities.speak) {
      abilitiesText.push('Speak');
    }
    if (abilities.read) {
      abilitiesText.push('Read');
    }
    if (abilities.write) {
      abilitiesText.push('Write');
    }
    if (abilities.type) {
      abilitiesText.push('Type');
    }

    if (abilitiesText.length > 0) {
      abilitiesText[0] = abilitiesText[0].charAt(0).toUpperCase() + abilitiesText[0].slice(1);
    }

    return abilitiesText.join(', ');
  };

  return (
    <ActionWidgetCard
      isEmpty={!language?.length}
      title="Languages"
      actionTitle="Edit languages"
      onActionClick={onEditClick}
    >
      <Grid display="flex" flexDirection="column">
        {isLoading
          ? Array.from({ length: 6 }, (_, index) => (
              <Box key={index} display="inline-flex" justifyContent="space-between">
                <Skeleton animation="wave" width={50} />
                <Skeleton animation="wave" width={96} />
              </Box>
            ))
          : language?.map((languages: Language) => (
              <Box key={languages.id} display="inline-flex" justifyContent="space-between" mb={1}>
                <Typography variant="body4" component="div">
                  {languages.name}
                </Typography>
                <Typography variant="body1-secondary" component="div">
                  {generateAbilitiesText(languages.abilities)}
                </Typography>
              </Box>
            ))}
      </Grid>
    </ActionWidgetCard>
  );
};

export default LanguagesWidget;
