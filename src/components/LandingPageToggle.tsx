import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

interface LandingPageToggleProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function LandingPageToggle({
  id,
  checked,
  onCheckedChange,
  disabled = false,
}: LandingPageToggleProps) {
  return (
    <SwitchPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '52px',
        height: '28px',
        flexShrink: 0,
        borderRadius: '999px',
        border: `2px solid ${checked ? '#3d9a47' : '#9ca3af'}`,
        backgroundColor: checked ? '#5fe85f' : '#d1d5db',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
        outline: 'none',
        boxShadow: checked
          ? 'inset 0 0 0 1px rgba(255,255,255,0.35)'
          : 'inset 0 0 0 1px rgba(255,255,255,0.2)',
      }}
    >
      <SwitchPrimitive.Thumb
        style={{
          display: 'block',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.25)',
          transform: checked ? 'translateX(24px)' : 'translateX(2px)',
          transition: 'transform 0.2s ease',
          pointerEvents: 'none',
        }}
      />
    </SwitchPrimitive.Root>
  );
}
