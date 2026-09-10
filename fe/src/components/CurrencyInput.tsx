import { useRef, useEffect } from 'react';
import { formatCurrency } from '../utils/currency';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  min?: number;
  required?: boolean;
  disabled?: boolean;
  id?: string;
}

export default function CurrencyInput({
  value,
  onChange,
  className = '',
  placeholder,
  min,
  required,
  disabled,
  id,
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingCursor = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const raw = input.value;
    const digits = raw.replace(/\D/g, '');
    const formatted = digits ? formatCurrency(digits) : '';

    if (formatted !== raw) {
      const cursor = input.selectionStart ?? 0;
      const digitsBefore = raw.slice(0, cursor).replace(/\D/g, '').length;

      let pos = 0;
      let count = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (formatted[i] !== '.') count++;
        if (count >= digitsBefore) {
          pos = i + 1;
          break;
        }
        pos = i + 1;
      }
      if (digitsBefore === 0) pos = 0;
      pendingCursor.current = pos;
    }

    onChange(formatted);
  };

  useEffect(() => {
    if (pendingCursor.current !== null && inputRef.current) {
      const pos = pendingCursor.current;
      inputRef.current.setSelectionRange(pos, pos);
      pendingCursor.current = null;
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      min={min}
      required={required}
      disabled={disabled}
      id={id}
    />
  );
}
