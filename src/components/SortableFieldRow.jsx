import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import { useBuilderTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

// Reorder rail: ↑ / drag handle / ↓. The arrows make reordering obvious and work with a tap,
// for people who never discover that the handle can be dragged.
export default function SortableFieldRow({ id, children, onMoveUp, onMoveDown }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const T = useBuilderTheme()
  const { t } = useLanguage()

  const railBtn = (enabled) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 26, height: 22, padding: 0, background: 'none', border: 'none',
    color: T.dragHandleColor, opacity: enabled ? 1 : 0.35,
    cursor: enabled ? 'pointer' : 'default', transition: 'color 0.15s',
  })
  const hover = e => { e.currentTarget.style.color = T.dragHandleHover }
  const unhover = e => { e.currentTarget.style.color = T.dragHandleColor }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 4,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, marginTop: 'clamp(14px, 2.4vw, 22px)' }}>
        <button type="button" onClick={onMoveUp ?? undefined} disabled={!onMoveUp}
          aria-label={t('move_up')} title={t('move_up')}
          style={railBtn(!!onMoveUp)} onMouseEnter={hover} onMouseLeave={unhover}>
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          style={{ ...railBtn(true), cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
          onMouseEnter={hover} onMouseLeave={unhover}
        >
          <GripVertical size={16} />
        </button>
        <button type="button" onClick={onMoveDown ?? undefined} disabled={!onMoveDown}
          aria-label={t('move_down')} title={t('move_down')}
          style={railBtn(!!onMoveDown)} onMouseEnter={hover} onMouseLeave={unhover}>
          <ChevronDown size={16} />
        </button>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  )
}
