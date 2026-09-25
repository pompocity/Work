import { Icon, Sheet } from './ui.jsx';
import { CATEGORIES } from '../data/mock.js';

export function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

export default function CategorySheet({ open, onClose, value, onChange }) {
  return (
    <Sheet open={open} onClose={onClose} title="Report Category" eyebrow="What needs fixing?" icon="category">
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIES.map((c) => {
          const active = c.id === value;
          return (
            <button
              key={c.id}
              onClick={() => {
                onChange(c.id);
                onClose();
              }}
              className={`flex flex-col items-start gap-2 rounded-xl p-3 text-left transition-all ${
                active ? 'border-2 border-teal bg-teal/5' : 'border border-tint-border bg-tint hover:bg-tint-hover'
              }`}
            >
              <Icon name={c.icon} fill={active} className={`text-[22px] ${active ? 'text-teal' : 'text-indigo'}`} />
              <span className="text-[12px] font-bold leading-tight text-indigo">{c.label}</span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
