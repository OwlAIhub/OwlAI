'use client';

import { cn } from '@/lib/utils';
import { Search, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type ChatSearchBarProps = {
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  className?: string;
  initialValue?: string;
  placeholder?: string;
};

export function ChatSearchBar({
  onChange,
  onSubmit,
  className,
  initialValue = '',
  placeholder = 'Ask me anything...',
}: ChatSearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit?.(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Auto-focus on mount
  useEffect(() => {
    if (initialValue) {
      inputRef.current?.focus();
    }
  }, [initialValue]);

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div className='relative group'>
        {/* Search container with modern styling */}
        <div
          className={cn(
            'relative flex items-center bg-background border border-border rounded-xl transition-all duration-200',
            'hover:border-primary/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20',
            isFocused && 'shadow-sm',
            'px-3 sm:px-4 py-2.5 sm:py-3'
          )}
        >
          {/* Search icon */}
          <div className='flex-shrink-0 mr-2 sm:mr-3'>
            <Search
              className={cn(
                'w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200',
                isFocused ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>

          {/* Input field */}
          <input
            ref={inputRef}
            type='text'
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={cn(
              'flex-1 bg-transparent border-none outline-none text-xs sm:text-sm placeholder:text-muted-foreground/60',
              'focus:placeholder:text-muted-foreground/40 transition-colors duration-200',
              'min-w-0' // Prevent overflow
            )}
            autoComplete='off'
            spellCheck='false'
          />

          {/* Submit button */}
          <button
            type='submit'
            disabled={!value.trim()}
            className={cn(
              'flex-shrink-0 ml-2 sm:ml-3 p-1 sm:p-1.5 rounded-lg transition-all duration-200',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              'enabled:hover:bg-primary/10 enabled:active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1'
            )}
            aria-label='Send message'
          >
            <Send
              className={cn(
                'w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200',
                value.trim() ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </button>
        </div>

        {/* Subtle glow effect on focus */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 transition-opacity duration-200 pointer-events-none',
            isFocused && 'opacity-100'
          )}
        />
      </div>
    </form>
  );
}
