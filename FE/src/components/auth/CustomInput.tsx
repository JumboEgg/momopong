import React, { useState, InputHTMLAttributes } from 'react';

type CustomInputType = 'text' | 'password' | 'email' | 'tel';

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
  value,
  required,
  onChange,
  className,
  onBlur,
  ...rest
}: CustomInputProps) {
  const inputId = React.useId();
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) {
      onBlur(e);
    }
  };

  const getInputClassName = () => {
    const baseClasses = 'w-full px-4 py-2 border rounded-xl focus:outline-none transition-colors duration-200';

    if (errorMessage) {
      return `${baseClasses} border-red-500 focus:ring-2 focus:ring-red-500 ${className || ''}`;
    }

    if (isFocused) {
      return `${baseClasses} border-blue-500 focus:ring-2 focus:ring-blue-500 ${className || ''}`;
    }

    return `${baseClasses} border-gray-200 focus:ring-2 focus:ring-blue-500 ${className || ''}`;
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={getInputClassName()}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}

export default CustomInput;
