import { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

import useClipText from '@utils/hooks/clipText.hook';

import { Typography, Link } from '@ui/typography';
import { Collapse } from '@ui/transition';
import { styled } from '@ui/theme';

type TextClipperProps = {
  text?: string;
  rows?: number;
  padEnd?: number;
  isShowFull?: boolean;
  isShowSeeMoreBtn?: boolean;
};

const Text = styled(Typography)(() => ({
  position: 'relative',
  width: '100%',
}));

const SeeMoreButton = styled(Link)(({ theme }) => ({
  fontWeight: theme.fontWeight.semiBold,
  verticalAlign: 'top',
})) as typeof Link;

/**
 * Renders a text clipper component that truncates long text and shows a "See more" button to expand it.
 * @param {TextClipperProps} props - The props for the component.
 * @param {string} props.text - The text to be clipped.
 * @returns {JSX.Element} - The JSX element for the component.
 */
export default function TextClipper({
  text,
  rows,
  isShowFull = false,
  isShowSeeMoreBtn = true,
  padEnd = 0,
}: TextClipperProps) {
  const containerId = useMemo(() => uuidv4(), []);
  const [clippedText, isClipped, containerHeight, setClipText] = useClipText(
    containerId,
    text || '',
    rows || 2,
    !padEnd ? (isShowSeeMoreBtn ? 90 : 10) : padEnd
  );
  const [isSeeMore, setIsSeeMore] = useState(isShowFull);
  const [isShowClippedText, setIsShowClippedText] = useState(!isShowFull);

  useEffect(() => {
    if (text?.length) {
      setClipText(text);
    }
  }, [text]);

  useEffect(() => {
    setIsSeeMore(isShowFull);

    if (isShowFull) {
      setIsShowClippedText(false);
    }
  }, [isShowFull]);

  return text ? (
    <Text variant="body4">
      <Collapse
        collapsedSize={containerHeight || 0}
        in={isSeeMore || !isClipped}
        id={containerId}
        onExited={() => setIsShowClippedText(true)}
      >
        {!isShowClippedText || !isClipped ? `${text || ''}    ` : `${clippedText}...    `}
        {isClipped && isShowSeeMoreBtn ? (
          <SeeMoreButton
            component="button"
            underline="hover"
            onClick={() => {
              setIsShowClippedText(false);
              setIsSeeMore(!isSeeMore);
            }}
          >
            {isSeeMore ? 'Show Less' : 'See more'}
          </SeeMoreButton>
        ) : (
          ''
        )}
      </Collapse>
    </Text>
  ) : (
    <></>
  );
}
