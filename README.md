# Dynamic Form Builder

A professional, pixel-perfect Dynamic Form Builder built with React 19+ that allows users to create custom forms through an intuitive drag-and-drop interface.

## Features

### Core Functionality
- **Dynamic Form Building**: Create sections, groups, and fields dynamically
- **Drag & Drop Interface**: Intuitive drag-and-drop from sidebar to form canvas
- **Pixel-Perfect Design**: Matches provided Figma specifications exactly
- **State Management**: Robust Redux Toolkit implementation with undo/redo
- **Local Storage**: Form data persistence across sessions

### Field Types Supported
- **Text Input** (Name, Email, etc.)
- **Radio Buttons** (Yes/No selections)
- **Checkboxes** (Multiple option selections)
- **File Upload** (Photo upload with drag-and-drop)
- **Dropdown/Select** (Option selection)
- **Custom Fields** (Extensible field system)

### User Interface Features
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth animations
- **Real-time Editing**: Inline editing of titles and properties
- **Visual Feedback**: Clear drag states and hover effects

## Technology Stack
- **React 18+** - Latest React with hooks and functional components
- **Redux Toolkit** - Modern Redux for state management
- **@dnd-kit** - Modern drag-and-drop library
- **Ant Design** - Professional UI component library
- **SASS/SCSS** - Advanced CSS preprocessing
- **React Icons** - Comprehensive icon library

## Project Structure

```
src/
├── components/
│   └── FormBuilder/
│       ├── FormBuilder.js          # Main form builder component
│       ├── FormBuilder.scss        # Main styling
│       ├── Header/                 # Header component with actions
│       ├── Section/                # Section management
│       ├── Group/                  # Group containers
│       ├── Field/                  # Individual form fields
│       ├── ElementsSidebar/        # Draggable elements sidebar
│       │   └── DraggableElement/   # Individual draggable items
│       └── DragOverlayContent/     # Drag overlay component
├── store/
│   ├── store.js                    # Redux store configuration
│   └── formBuilderSlice.js         # Form builder state management
├── App.js                          # Main application component
├── App.scss                        # Global application styles
└── index.js                        # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Danny-Flames/flames-drag-and-drop-solution.git
   cd react-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
Navigate to `http://localhost:5173` to see the application

### Building for Production

```bash
npm run build
# or
yarn build
```

## Usage Guide

### Creating a Form

1. **Add Section**: Click "Add Section" to create a new form section
2. **Edit Section Title**: Click on the section title to edit it inline
3. **Add Groups**: Within each section, click "Add Group" to create field containers
4. **Edit Group Title**: Click on group titles to customize them
5. **Add Fields**: Drag field types from the right sidebar into groups
6. **Configure Fields**: 
   - Click field labels to edit them
   - Use toggles for "Full Width" and "Required" properties
   - Reorder fields by dragging within groups


### Component Architecture
- **Functional Components**: All components use React hooks
- **Single Responsibility**: Each component has a focused purpose
- **Prop Drilling Avoided**: Redux used for complex state management
- **Performance Optimized**: Memoization where beneficial

### State Management
- **Redux Toolkit**: Modern Redux patterns
- **Normalized State**: Efficient data structure
- **Immutable Updates**: Safe state modifications
- **History Management**: Undo/redo functionality

### Styling Guidelines
- **SCSS Modules**: Component-scoped styling
- **CSS Variables**: Consistent theming
- **Mobile-First**: Responsive design approach
- **Ant Design Integration**: Consistent with design system

## Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Redux Toolkit Guide](https://redux-toolkit.js.org/)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [Ant Design Components](https://ant.design/components/overview/)
- [SCSS Guide](https://sass-lang.com/guide)
