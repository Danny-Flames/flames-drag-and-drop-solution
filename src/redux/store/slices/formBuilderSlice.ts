import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  description?: string;
  defaultValue?: string;
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

export interface FormBuilderSnapshot {
  formTitle: string;
  sections: FormSection[];
  formSettings: {
    theme: string;
    submitButton: string;
    allowDraft: boolean;
  };
}

interface FormBuilderState {
  present: FormBuilderSnapshot;
  past: FormBuilderSnapshot[];
  future: FormBuilderSnapshot[];
  selectedField: string | null;
  draggedFieldType: string | null;
}

const DEFAULT_SNAPSHOT: FormBuilderSnapshot = {
  formTitle: "Untitled Form",
  sections: [],
  formSettings: {
    theme: "default",
    submitButton: "Submit",
    allowDraft: true,
  },
};

const STORAGE_KEY = "flames-form-builder-state";
const MAX_HISTORY = 50;

function loadFromStorage(): FormBuilderSnapshot {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FormBuilderSnapshot;
  } catch {}
  return DEFAULT_SNAPSHOT;
}

function saveToStorage(snapshot: FormBuilderSnapshot) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {}
}

function pushHistory(
  state: FormBuilderState,
  nextPresent: FormBuilderSnapshot
) {
  state.past = [...state.past.slice(-MAX_HISTORY + 1), state.present];
  state.future = [];
  state.present = nextPresent;
  saveToStorage(nextPresent);
}

const initialState: FormBuilderState = {
  present: loadFromStorage(),
  past: [],
  future: [],
  selectedField: null,
  draggedFieldType: null,
};

export const formBuilderSlice = createSlice({
  name: "formBuilder",
  initialState,
  reducers: {
    undo: (state) => {
      if (state.past.length === 0) return;
      const previous = state.past[state.past.length - 1];
      state.future = [state.present, ...state.future];
      state.past = state.past.slice(0, -1);
      state.present = previous;
      saveToStorage(previous);
    },
    redo: (state) => {
      if (state.future.length === 0) return;
      const next = state.future[0];
      state.past = [...state.past, state.present];
      state.future = state.future.slice(1);
      state.present = next;
      saveToStorage(next);
    },
    setFormTitle: (state, action: PayloadAction<string>) => {
      pushHistory(state, { ...state.present, formTitle: action.payload });
    },
    addSection: (state) => {
      const newSection: FormSection = {
        id: uuidv4(),
        title: `Section ${state.present.sections.length + 1}`,
        fields: [],
      };
      pushHistory(state, {
        ...state.present,
        sections: [...state.present.sections, newSection],
      });
    },
    updateSectionTitle: (
      state,
      action: PayloadAction<{ sectionId: string; title: string }>
    ) => {
      pushHistory(state, {
        ...state.present,
        sections: state.present.sections.map((s) =>
          s.id === action.payload.sectionId
            ? { ...s, title: action.payload.title }
            : s
        ),
      });
    },
    deleteSection: (state, action: PayloadAction<string>) => {
      pushHistory(state, {
        ...state.present,
        sections: state.present.sections.filter((s) => s.id !== action.payload),
      });
      if (state.selectedField) state.selectedField = null;
    },
    reorderSections: (
      state,
      action: PayloadAction<{ oldIndex: number; newIndex: number }>
    ) => {
      const sections = [...state.present.sections];
      const [moved] = sections.splice(action.payload.oldIndex, 1);
      sections.splice(action.payload.newIndex, 0, moved);
      pushHistory(state, { ...state.present, sections });
    },
    addField: (
      state,
      action: PayloadAction<{
        sectionId: string;
        field: Omit<FormField, "id">;
        index?: number;
      }>
    ) => {
      const newField: FormField = { ...action.payload.field, id: uuidv4() };
      const sections = state.present.sections.map((s) => {
        if (s.id !== action.payload.sectionId) return s;
        const fields = [...s.fields];
        if (action.payload.index !== undefined) {
          fields.splice(action.payload.index, 0, newField);
        } else {
          fields.push(newField);
        }
        return { ...s, fields };
      });
      pushHistory(state, { ...state.present, sections });
    },
    updateField: (
      state,
      action: PayloadAction<{
        sectionId: string;
        fieldId: string;
        updates: Partial<FormField>;
      }>
    ) => {
      const sections = state.present.sections.map((s) => {
        if (s.id !== action.payload.sectionId) return s;
        return {
          ...s,
          fields: s.fields.map((f) =>
            f.id === action.payload.fieldId
              ? { ...f, ...action.payload.updates }
              : f
          ),
        };
      });
      pushHistory(state, { ...state.present, sections });
    },
    deleteField: (
      state,
      action: PayloadAction<{ sectionId: string; fieldId: string }>
    ) => {
      const sections = state.present.sections.map((s) => {
        if (s.id !== action.payload.sectionId) return s;
        return {
          ...s,
          fields: s.fields.filter((f) => f.id !== action.payload.fieldId),
        };
      });
      pushHistory(state, { ...state.present, sections });
      if (state.selectedField === action.payload.fieldId)
        state.selectedField = null;
    },
    reorderFields: (
      state,
      action: PayloadAction<{
        sectionId: string;
        oldIndex: number;
        newIndex: number;
      }>
    ) => {
      const sections = state.present.sections.map((s) => {
        if (s.id !== action.payload.sectionId) return s;
        const fields = [...s.fields];
        const [moved] = fields.splice(action.payload.oldIndex, 1);
        fields.splice(action.payload.newIndex, 0, moved);
        return { ...s, fields };
      });
      pushHistory(state, { ...state.present, sections });
    },
    moveFieldToSection: (
      state,
      action: PayloadAction<{
        fromSectionId: string;
        toSectionId: string;
        fieldId: string;
        toIndex: number;
      }>
    ) => {
      const { fromSectionId, toSectionId, fieldId, toIndex } = action.payload;
      let movedField: FormField | null = null;
      const afterRemove = state.present.sections.map((s) => {
        if (s.id === fromSectionId) {
          const field = s.fields.find((f) => f.id === fieldId);
          if (field) movedField = field;
          return { ...s, fields: s.fields.filter((f) => f.id !== fieldId) };
        }
        return s;
      });
      if (!movedField) return;
      const finalSections = afterRemove.map((s) => {
        if (s.id === toSectionId) {
          const fields = [...s.fields];
          fields.splice(toIndex, 0, movedField!);
          return { ...s, fields };
        }
        return s;
      });
      pushHistory(state, { ...state.present, sections: finalSections });
    },
    updateFormSettings: (
      state,
      action: PayloadAction<Partial<FormBuilderSnapshot["formSettings"]>>
    ) => {
      pushHistory(state, {
        ...state.present,
        formSettings: { ...state.present.formSettings, ...action.payload },
      });
    },
    clearForm: (state) => {
      pushHistory(state, DEFAULT_SNAPSHOT);
      state.selectedField = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
    loadSnapshot: (state, action: PayloadAction<FormBuilderSnapshot>) => {
      state.present = action.payload;
      state.past = [];
      state.future = [];
      saveToStorage(action.payload);
    },
    setSelectedField: (state, action: PayloadAction<string | null>) => {
      state.selectedField = action.payload;
    },
    setDraggedFieldType: (state, action: PayloadAction<string | null>) => {
      state.draggedFieldType = action.payload;
    },
  },
});

export const {
  undo,
  redo,
  setFormTitle,
  addSection,
  updateSectionTitle,
  deleteSection,
  reorderSections,
  addField,
  updateField,
  deleteField,
  reorderFields,
  moveFieldToSection,
  updateFormSettings,
  clearForm,
  loadSnapshot,
  setSelectedField,
  setDraggedFieldType,
} = formBuilderSlice.actions;

export default formBuilderSlice.reducer;