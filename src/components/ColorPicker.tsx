import type { ColorOption } from '../types/product';

interface ColorPickerProps {
  selected: ColorOption;
  onChange: (color: ColorOption) => void;
}

const colorOptions: { value: ColorOption; label: string; colorClass: string }[] = [
  { value: 'yellow', label: 'Yellow Gold', colorClass: 'bg-yellow-500' },
  { value: 'rose', label: 'Rose Gold', colorClass: 'bg-rose-400' },
  { value: 'white', label: 'White Gold', colorClass: 'bg-neutral-300' },
];

export function ColorPicker({ selected, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center space-x-2">
      {colorOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`w-8 h-8 rounded-full border-2 transition-all ${
            selected === option.value
              ? 'border-neutral-900 scale-110'
              : 'border-neutral-300 hover:border-neutral-500'
          }`}
          title={option.label}
        >
          <div className={`w-full h-full rounded-full ${option.colorClass}`}></div>
        </button>
      ))}
    </div>
  );
}
