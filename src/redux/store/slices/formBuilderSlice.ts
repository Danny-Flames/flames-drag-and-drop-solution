import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

interface FormBuilderState {
  formTitle: string;
  sections: FormSection[];
  selectedField: string | null;
  draggedField: FormField | null;
  formSettings: {
    theme: string;
    submitButton: string;
    allowDraft: boolean;
  };
}

const initialState: FormBuilderState = {
  formTitle: 'Untitled Form',
  sections: [],
  selectedField: null,
  draggedField: null,
  formSettings: {
    theme: 'default',
    submitButton: 'Submit',
    allowDraft: true,
  },
};

export const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setFormTitle: (state, action: PayloadAction<string>) => {
      state.formTitle = action.payload;
    },
    
    addSection: (state) => {
      const newSection: FormSection = {
        id: uuidv4(),
        title: 'New Section',
        fields: [],
      };
      state.sections.push(newSection);
    },
    
    updateSectionTitle: (state, action: PayloadAction<{ sectionId: string; title: string }>) => {
      const section = state.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        section.title = action.payload.title;
      }
    },
    
    deleteSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter(s => s.id !== action.payload);
    },
    
    addField: (state, action: PayloadAction<{ sectionId: string; field: Omit<FormField, 'id'> }>) => {
      const section = state.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        const newField: FormField = {
          ...action.payload.field,
          id: uuidv4(),
        };
        section.fields.push(newField);
      }
    },
    
    updateField: (state, action: PayloadAction<{ sectionId: string; fieldId: string; updates: Partial<FormField> }>) => {
      const section = state.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        const field = section.fields.find(f => f.id === action.payload.fieldId);
        if (field) {
          Object.assign(field, action.payload.updates);
        }
      }
    },
    
    deleteField: (state, action: PayloadAction<{ sectionId: string; fieldId: string }>) => {
      const section = state.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        section.fields = section.fields.filter(f => f.id !== action.payload.fieldId);
      }
    },
    
    reorderFields: (state, action: PayloadAction<{ sectionId: string; oldIndex: number; newIndex: number }>) => {
      const section = state.sections.find(s => s.id === action.payload.sectionId);
      if (section) {
        const { oldIndex, newIndex } = action.payload;
        const [reorderedField] = section.fields.splice(oldIndex, 1);
        section.fields.splice(newIndex, 0, reorderedField);
      }
    },
    
    setSelectedField: (state, action: PayloadAction<string | null>) => {
      state.selectedField = action.payload;
    },
    
    setDraggedField: (state, action: PayloadAction<FormField | null>) => {
      state.draggedField = action.payload;
    },
    
    updateFormSettings: (state, action: PayloadAction<Partial<FormBuilderState['formSettings']>>) => {
      state.formSettings = { ...state.formSettings, ...action.payload };
    },
  },
});

export const {
  setFormTitle,
  addSection,
  updateSectionTitle,
  deleteSection,
  addField,
  updateField,
  deleteField,
  reorderFields,
  setSelectedField,
  setDraggedField,
  updateFormSettings,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;