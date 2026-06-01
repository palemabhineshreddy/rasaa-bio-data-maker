import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useBuilderTheme } from '../contexts/ThemeContext'

export default function SortableFieldRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const T = useBuilderTheme()

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
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        style={{
          flexShrink: 0,
          marginTop: 'clamp(20px, 3vw, 28px)',
          background: 'none',
          border: 'none',
          padding: '4px 2px',
          cursor: isDragging ? 'grabbing' : 'grab',
          color: T.dragHandleColor,
          touchAction: 'none',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = T.dragHandleHover }}
        onMouseLeave={e => { e.currentTarget.style.color = T.dragHandleColor }}
      >
        <GripVertical size={15} />
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
