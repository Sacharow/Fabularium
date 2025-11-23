import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

export interface CustomCheckboxProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  size?: number; // px for the visual box (square)
  color?: string; // tailwind color class prefix (e.g. 'yellow-300')
  indeterminate?: boolean;
}

const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(({
  id,
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  className = "",
  size = 20,
  color = "yellow-300",
  indeterminate = false,
}, ref) => {
  const internalRef = useRef<HTMLInputElement | null>(null);

  // expose the input ref to parents
  useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = Boolean(indeterminate) && !internalRef.current.checked;
    }
  }, [indeterminate, checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e.target.checked);
  };

  // visual size classes aren't necessary since project uses Tailwind; inline style for square size
  const boxStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
  };

  // dynamic classes for checked state are handled by sibling selectors via input:checked + .visual in Tailwind,
  // but to keep this file self-contained we toggle classes with React state via props

  return (
    <label
      htmlFor={id}
      className={`text-gray-500 hover:underline inline-flex items-center gap-2 cursor-pointer select-none ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      <input
        id={id}
        ref={internalRef}
        type="checkbox"
        className="sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={handleChange}
        disabled={disabled}
        aria-checked={indeterminate ? "mixed" : checked}
      />

      <span
        aria-hidden
        style={boxStyle}
        className={`text-white flex items-center justify-center rounded-sm border-2 transition-all duration-150 ease-in-out bg-transparent border-${color}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="w-4 h-4 text-white opacity-0 transform scale-90 transition-all duration-150 pointer-events-none"
        >
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {label && <span className="text-sm text-gray-500">{label}</span>}

      <style>{`
        /* show checkmark when input is checked - use opacity/transform to avoid layout shifts */
        input:checked + span > svg { opacity: 1 !important; transform: none !important; }
        input:indeterminate + span { background-color: var(--tw-bg-opacity, 1); }
      `}</style>
    </label>
  );
});

CustomCheckbox.displayName = "CustomCheckbox";

export default CustomCheckbox;
