import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export default function SortableFieldRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 6,
      }}
    >
      {/* Drag handle — visible on hover */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        style={{
          flexShrink: 0,
          marginTop: 28,
          background: 'none',
          border: 'none',
          padding: '4px 2px',
          cursor: isDragging ? 'grabbing' : 'grab',
          color: 'rgba(255,255,255,0.18)',
          touchAction: 'none',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'rgba(168,85,247,0.7)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.18)' }}
      >
        <GripVertical size={15} />
      </button>

      {/* Field content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
