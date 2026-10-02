import { useRef, useCallback, useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragCancelEvent,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
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

  // NOTE: this transform is only the bounded reorder offset. The element that
  // actually follows the cursor is the DragOverlay, which is portalled to
  // <body> - so it can never inflate this container's scrollable overflow.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.sortableItemWrap}
      data-dragging={isDragging ? '' : undefined}
      {...attributes}
      {...listeners}
    >
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
  const [activeId, setActiveId] = useState<string | null>(null);

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

  const lockRootScroll = useCallback(() => {
    document.documentElement.classList.add('dragging-active');
  }, []);

  const unlockRootScroll = useCallback(() => {
    document.documentElement.classList.remove('dragging-active');
  }, []);

  // Never leave the root scroller locked if the list unmounts mid-drag.
  useEffect(() => unlockRootScroll, [unlockRootScroll]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    lockRootScroll();
    setActiveId(String(event.active.id));
  }, [lockRootScroll]);

  const handleDragCancel = useCallback((_event: DragCancelEvent) => {
    unlockRootScroll();
    setActiveId(null);
  }, [unlockRootScroll]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    unlockRootScroll();
    setActiveId(null);

    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSortedItems((currentItems: T[]) => {
        const oldIndex = currentItems.findIndex((item: T) => getId(item) === active.id);
        const newIndex = currentItems.findIndex((item: T) => getId(item) === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(currentItems, oldIndex, newIndex);
          onReorder(newItems);
          return newItems;
        }
        return currentItems;
      });
    }
  }, [getId, onReorder, unlockRootScroll]);

  if (sortedItems.length === 0) {
    return <div className={styles.emptyState}>{emptyMessage}</div>;
  }

  const itemIds = sortedItems.map(getId);
  const activeItem = activeId !== null
    ? sortedItems.find((item: T) => getId(item) === activeId)
    : undefined;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      onDragEnd={handleDragEnd}
      // dnd-kit's own auto-scroller runs on a timer, so it keeps scrolling while
      // the pointer is held still against an edge - and it treats the top and
      // bottom edges symmetrically via Direction.Backward / Direction.Forward.
      autoScroll={{
        enabled: true,
        // Trigger zone = the outer 20% of the container's height.
        threshold: { x: 0, y: 0.2 },
        acceleration: 10,
        interval: 20,
        // Only the list container may scroll. This is what keeps the page from
        // growing a second scrollbar: dnd-kit puts
        // `document.scrollingElement` into its scrollable-ancestor list
        // (getScrollableAncestors), so it has to be filtered out explicitly.
        canScroll: (element) => (
          element === containerRef.current
          && element !== document.scrollingElement
        ),
        // Must stay false: dnd-kit reads this independently of `enabled` and
        // defaults it to true, which makes it scroll ancestors to "compensate"
        // for the dragged node shifting downwards.
        layoutShiftCompensation: false,
      }}
      // Keep the drag on the vertical axis and inside the parent element so it
      // can never drift sideways or escape the list.
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div
          ref={containerRef}
          className={styles.sortableList}
          role="list"
          aria-label="Danh sách có thể sắp xếp"
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

      {/* Rendered in a portal on <body>: the dragged preview follows the cursor
          without ever extending this container's scrollable area, which is what
          caused the unbounded black gap when dragging downwards. */}
      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div className={styles.dragOverlayCard}>{renderItem(activeItem)}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}