import React, { useEffect, useState } from 'react';
import ActionWidgetCard from '@globals/actionWidgetCard';
import { useAtom } from 'jotai';
import { Grid } from '@ui/layout';
import { Typography } from '@ui/typography';
import { Chip } from '@ui/chip';
import { Skeleton } from '@ui/skeleton';
import { Skill } from '@utils/types/preference/languages.type';
import { storeSkillsAtom } from '@serverAtoms/preferences/skills/storeSkills.atom';
import { Button } from '@ui/button';
import CustomModal from '@ui/customModal';
import { useTheme } from '@ui/theme';

type SkillsAndTalentsWidgetProps = {
  onEditClick?: () => void;
};

const SkillsAndTalentsWidget: React.FC<SkillsAndTalentsWidgetProps> = ({ onEditClick = () => undefined }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [skillsAtom] = useAtom(storeSkillsAtom);
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [skill, setSkills] = useState<Skill[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { palette } = useTheme();

  useEffect(() => {
    setSkillsData(skillsAtom?.data?.data as unknown as Skill[]);
  }, [skillsAtom?.data?.data]);

  useEffect(() => {
    setIsLoading(skillsAtom?.isLoading);
  }, [skillsAtom?.data?.data]);

  useEffect(() => {
    if (skillsData?.length > 0) {
      const newSkills = skillsData.map((skill: Skill) => {
        return {
          id: skill.id,
          name: skill.name,
          default_skill: skill.default_skill,
        };
      });
      setSkills(newSkills);
    } else {
      setSkills([]);
    }
  }, [skillsData]);
  return (
    <>
      <ActionWidgetCard
        isEmpty={!skillsData?.length}
        title="Skills and Talents"
        actionTitle="Edit skills and talents"
        onActionClick={onEditClick}
      >
        <Grid flexWrap="wrap" mb={2} columnGap={1} rowGap={1} display="flex">
          {isLoading
            ? Array.from({ length: 8 }, (_, index) => <Skeleton animation="wave" width={25 * index} />)
            : skill
                .slice(0, 5)
                .map((values) => (
                  <Chip
                    key={`chip-${'index'}`}
                    sx={{ width: 'auto', height: '28px', p: '4px 0', bgcolor: palette.primary.light }}
                    label={<Typography variant="body4">{values.name}</Typography>}
                  />
                ))}
          {skill && skill.length > 6 && (
            <Button
              sx={{ pl: 0, pr: 0, mt: 0.5, height: 20, minHeight: 20, transform: 'translateX(10px)' }}
              variant="custom"
              onClick={() => setModalOpen(!modalOpen)}
            >
              Show more
            </Button>
          )}
        </Grid>
      </ActionWidgetCard>

      <CustomModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(!modalOpen);
        }}
        title="Skills and talents"
        width={758}
      >
        <div>
          <Grid flexWrap="wrap" mb={2} columnGap={1} rowGap={1} display="flex">
            {skill.map((values) => (
              <Chip
                key={`chip-${'index'}`}
                sx={{ width: 'auto', height: '28px', p: '4px 0', bgcolor: palette.primary.light }}
                label={<Typography variant="body4">{values.name}</Typography>}
              />
            ))}
          </Grid>
        </div>
      </CustomModal>
    </>
  );
};

export default SkillsAndTalentsWidget;
