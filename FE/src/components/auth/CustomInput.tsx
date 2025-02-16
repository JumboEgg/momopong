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
  ...rest
}: CustomInputProps) {
  const inputId = React.useId(); // 실제 id
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`input-wrapper ${isFocused ? 'focused' : ''} min-w-400 gap-3`}>
      {label && (
        <label
          htmlFor={inputId} // input과 연결
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId} // label과 연결
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isFocused ? 'ring-2 ring-blue-500' : ''
        } ${className || ''}`}
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
