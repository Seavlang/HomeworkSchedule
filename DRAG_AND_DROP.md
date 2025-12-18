# Drag and Drop Feature

## Overview

The Homework Schedule Manager now includes a drag-and-drop interface that allows teachers to quickly reschedule homework assignments by dragging them to different dates on the calendar.

## Features

### Visual Feedback
- **Drag Handle**: Each homework card displays a grip icon (⋮⋮) indicating it's draggable
- **Hover States**: Calendar cells highlight when you drag over them
- **Drop Zones**: Empty calendar cells show a "Drop here" indicator when dragging
- **Drag Overlay**: A semi-transparent preview follows your cursor while dragging
- **Active State**: The original card becomes semi-transparent while dragging

### User Experience
- **Activation Distance**: Requires 8px of movement before dragging starts (prevents accidental drags)
- **Keyboard Support**: Full keyboard accessibility support
- **Smooth Animations**: Transitions and transforms for a polished feel
- **Optimistic Updates**: UI updates immediately, then syncs with server

## How to Use

1. **Start Dragging**: Click and hold on any homework card in the calendar
2. **Drag**: Move your mouse over different calendar dates
3. **Drop**: Release the mouse button over a date cell to reschedule
4. **Confirmation**: The homework's due date updates automatically

## Technical Implementation

### Components
- `DraggableHomeworkCard`: Individual homework items that can be dragged
- `DroppableDateCell`: Calendar date cells that accept drops
- `HomeworkCalendar`: Main calendar component with DndContext

### Libraries
- **@dnd-kit/core**: Core drag-and-drop functionality
- **@dnd-kit/utilities**: Utility functions
- **@dnd-kit/sortable**: Sortable list support (for future enhancements)

### API Integration
When a homework is dropped on a new date:
1. Frontend calls `updateHomework(homeworkId, { dueDate: newDate })`
2. Backend updates the database via Prisma
3. Frontend refreshes the homework list
4. Conflict detection runs automatically

## Accessibility

- Full keyboard navigation support
- Screen reader friendly
- ARIA attributes for drag operations
- Focus management during drag operations

## Future Enhancements

- Drag multiple items at once
- Undo/redo for drag operations
- Visual conflict warnings during drag
- Drag from list view to calendar
- Touch gesture support for mobile devices

