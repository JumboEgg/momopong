import React, { useState, InputHTMLAttributes } from 'react';

type CustomInputType = 'text' | 'password' | 'email';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  type: CustomInputType;
}

function CustomInput({
  label,
  type,
  errorMessage,
  placeholder,
  ...rest
}: CustomInputProps) {
  const id = React.useId();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`input-wrapper ${isFocused ? 'focused' : ''}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default CustomInput;
