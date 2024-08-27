import React, { useEffect } from 'react';

/**
 * Sets the styles of a mock container to match the styles of a source container.
 * @param container - The source container to match styles from.
 * @param mockContainer - The mock container to set styles on.
 */
const setStyles = (container: HTMLElement, mockContainer: HTMLElement) => {
  const srcStyles = window.getComputedStyle(container);

  mockContainer.style.lineHeight = srcStyles.lineHeight;
  mockContainer.style.fontSize = srcStyles.fontSize;
  mockContainer.style.fontWeight = srcStyles.fontWeight;
  mockContainer.style.border = srcStyles.border;
  mockContainer.style.padding = srcStyles.padding;
  mockContainer.style.letterSpacing = srcStyles.letterSpacing;
  mockContainer.style.position = 'absolute';
  mockContainer.style.top = '-9999px';
  mockContainer.style.left = '-9999px';
  mockContainer.style.visibility = 'hidden';
  mockContainer.style.width = `${container.offsetWidth}px`;
  mockContainer.style.backgroundColor = 'red';
  mockContainer.style.zIndex = '2000';
};

/**
 * Clips the given text to fit within the specified container with a maximum number of rows.
 * @param mockContainer - A mock container element used to calculate the height of the text.
 * @param container - The actual container element that the text will be displayed in.
 * @param text - The text to be clipped.
 * @param rows - The maximum number of rows that the text can occupy.
 * @param padEnd - The number of pixels to pad the end of each line with.
 * @returns A tuple containing the clipped text, a boolean indicating whether the text was clipped, and the height of the container.
 */
const clipText = (
  mockContainer: HTMLElement,
  container: HTMLElement,
  text: string,
  rows: number,
  padEnd: number
): [string, boolean, number] => {
  let result = '';
  const srcText = text.split(' ');
  const containerHeight = parseInt(mockContainer.style.lineHeight) * rows;
  const padSpace = `<span style="display:inline-block;width:${padEnd}px;height:12px" />`;

  mockContainer.style.width = `${container.offsetWidth}px`;

  for (let i = 0; i < srcText.length; i++) {
    mockContainer.innerHTML = result + srcText[i] + padSpace;
    if (mockContainer.scrollHeight <= containerHeight) {
      if (i !== 0) {
        result += ' ';
      }
      result += srcText[i];
    } else {
      return [result, true, containerHeight];
    }
  }

  return [result, false, 0];
};

/**
 * A hook that clips text to fit a container with a specified number of rows.
 * @param containerId - The ID of the container element.
 * @param text - The text to clip.
 * @param rows - The number of rows to fit the text into.
 * @param padEnd - The number of characters to pad the end of the clipped text with.
 * @returns An array containing the clipped text, a boolean indicating whether the text was clipped, the height of the container for the clipped text, and a function to set the text.
 */
export default function useClipText(
  containerId: string,
  text: string,
  rows: number,
  padEnd = 0
): [string, boolean, number, (text: string) => void] {
  const [clippedText, setClippedText] = React.useState<[string, boolean, number]>([text, false, 45]);
  let _container: HTMLElement;
  let mockContainer: HTMLElement;

  useEffect(() => {
    _container = document.getElementById(containerId) as HTMLElement;

    if (_container) {
      mockContainer = document.createElement('div');
      setStyles(_container, mockContainer);

      document.body.appendChild(mockContainer);

      const observer = new ResizeObserver(() => {
        setClippedText(clipText(mockContainer, _container, text, rows, padEnd));
      });
      observer.observe(_container);

      return () => {
        observer.disconnect();
        document.body.removeChild(mockContainer);
      };
    }
  }, []);

  useEffect(() => {
    if (mockContainer) {
      setStyles(_container, mockContainer);
      setClippedText(clipText(mockContainer, _container, text, rows, padEnd));
    }
  }, [text]);

  /**
   * Sets the clipped text.
   * @param text - The text to set.
   */
  const setText = (text: string) => {
    setClippedText([text, clippedText[1], clippedText[2]]);
  };

  return [clippedText[0], clippedText[1], clippedText[2], setText];
}
