import { LoadingButton } from '@ui/button';
import React, { ChangeEvent, FC, KeyboardEvent, useRef, useState } from 'react';

interface VerificationCodeInputProps {
  onSubmit: (code: string, setInputs: React.Dispatch<React.SetStateAction<string[]>>) => void;
  loading: boolean;
}

const VerificationCodeInput: FC<VerificationCodeInputProps> = ({ onSubmit, loading }) => {
  const [inputs, setInputs] = useState<string[]>(['', '', '', '', '', '']);
  const [isFirstInputFocused, setIsFirstInputFocused] = useState(false);
  const lastInputRef = useRef<HTMLInputElement>(null); // Create a ref for the last input

  const handleChange = (i: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Check if it's the first input and the value length is 6
    if (i === 0 && value.length === 6) {
      const values = value.split('');
      setInputs(values);
      lastInputRef.current?.focus();
    } else {
      const values = [...inputs];
      values[i] = value;
      setInputs(values);

      // If value is entered, focus the next input
      if (event.target.nextSibling && value) {
        (event.target.nextSibling as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (i: number, event: KeyboardEvent<HTMLInputElement>) => {
    // Check if backspace was pressed and input is empty
    if (event.key === 'Backspace' && !event.currentTarget.value && i > 0) {
      // Focus the previous input
      const inputsContainer = event.currentTarget.parentNode;
      if (inputsContainer) {
        const previousInput = inputsContainer.children[i - 1] as HTMLInputElement;
        previousInput.focus();
      }
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const code = inputs.join('');
    onSubmit(code, setInputs); // call the passed handleSubmit function with the code
  };

  // Check if all inputs are filled
  const allInputsFilled = inputs.every((input) => input !== '');

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0px 24px 0px' }}>
        {inputs.map((input, i) => (
          <input
            type="text"
            key={i}
            value={input}
            maxLength={i === 0 && isFirstInputFocused ? undefined : 1}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={() => i === 0 && setIsFirstInputFocused(true)}
            onBlur={() => i === 0 && setIsFirstInputFocused(false)}
            ref={i === inputs.length - 1 ? lastInputRef : null} // Assign the ref to the last input
            style={{
              width: '48px',
              height: '40px',
              textAlign: 'center',
              borderRadius: '8px',
              border: '1px solid var(--gray-3, #B5B9C5)',
            }}
          />
        ))}
      </div>
      <LoadingButton
        variant="contained"
        color="primary"
        type="submit"
        disabled={!allInputsFilled}
        sx={{ mt: '16px' }}
        loading={loading}
        fullWidth
      >
        Submit
      </LoadingButton>
    </form>
  );
};

export default VerificationCodeInput;
