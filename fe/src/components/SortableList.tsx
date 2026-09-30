import { useRef, useCallback, useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import styles from './SortableList.module.css';

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
};

function SortableItem({ id, children, disabled = false }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} data-dragging={isDragging ? '' : undefined}>
      <div className={styles.sortableItem}>
        <button
          type="button"
          className={styles.dragHandle}
          aria-label="Kéo để sắp xếp"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </button>
        <div className={styles.itemContent}>{children}</div>
      </div>
    </div>
  );
}

type SortableListProps<T> = {
  items: T[];
  getId: (item: T) => string;
  renderItem: (item: T) => React.ReactNode;
  onReorder: (items: T[]) => void;
  disabled?: boolean;
  emptyMessage?: string;
  itemDisabled?: (item: T) => boolean;
};

export default function SortableList<T>({
  items,
  getId,
  renderItem,
  onReorder,
  disabled = false,
  emptyMessage = 'Không có dữ liệu',
  itemDisabled,
}: SortableListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sortedItems, setSortedItems] = useState<T[]>(items);

  // Sync internal state with parent items when they change (but not during drag)
  useEffect(() => {
    setSortedItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback(() => {
    // Prevent body scroll during drag
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'contain';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'contain';
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.overscrollBehavior = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overscrollBehavior = '';

    const { active, over } = event;
    console.log('DragEnd:', { activeId: active?.id, overId: over?.id });

    if (over && active.id !== over.id) {
      setSortedItems((currentItems: T[]) => {
        const oldIndex = currentItems.findIndex((item: T) => getId(item) === active.id);
        const newIndex = currentItems.findIndex((item: T) => getId(item) === over.id);
        console.log('Reorder indices:', { oldIndex, newIndex });
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(currentItems, oldIndex, newIndex);
          onReorder(newItems);
          return newItems;
        }
        return currentItems;
      });
    }
  }, [getId, onReorder]);

  // Prevent auto-scroll when dragging near edges
  const handleDragOver = useCallback((event: DragOverEvent) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const activatorEvent = event.activatorEvent as MouseEvent | TouchEvent | undefined;
    let clientY = 0;
    if (activatorEvent) {
      if ('clientY' in activatorEvent) {
        clientY = activatorEvent.clientY;
      } else if ('touches' in activatorEvent && activatorEvent.touches.length > 0) {
        clientY = activatorEvent.touches[0].clientY;
      }
    }
    
    // Only allow scrolling within the container, not the window
    const scrollThreshold = 50;
    const isNearTop = clientY - rect.top < scrollThreshold;
    const isNearBottom = rect.bottom - clientY < scrollThreshold;
    
    if (isNearTop) {
      container.scrollTop = Math.max(0, container.scrollTop - 10);
    } else if (isNearBottom) {
      container.scrollTop = Math.min(
        container.scrollHeight - container.clientHeight,
        container.scrollTop + 10
      );
    }
  }, []);

  if (sortedItems.length === 0) {
    return <div className={styles.emptyState}>{emptyMessage}</div>;
  }

  const itemIds = sortedItems.map(getId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      autoScroll={false}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div 
          ref={containerRef}
          className={styles.sortableList} 
          role="list" 
          aria-label="Danh sách có thể sắp xếp"
          style={{ 
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
          }}
        >
          {sortedItems.map((item) => (
            <SortableItem
              key={getId(item)}
              id={getId(item)}
              disabled={disabled || (itemDisabled?.(item) ?? false)}
            >
              {renderItem(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}