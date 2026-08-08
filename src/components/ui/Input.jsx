import React from 'react';

const Input = React.forwardRef(({ label, id, error, className = '', ...props }, ref) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input
        ref={ref}
        id={id}
        className="input"
        {...props}
      />
      {error && <span className="text-error text-sm mt-1 block">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
