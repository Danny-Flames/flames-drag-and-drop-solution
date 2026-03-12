import { FormBuilderSnapshot } from "../redux/store/slices/formBuilderSlice";

export interface SavedForm {
  id: string;
  snapshot: FormBuilderSnapshot;
  savedAt: string; // ISO string
  updatedAt: string;
}

const SAVED_FORMS_KEY = "flames-saved-forms";
const ACTIVE_FORM_KEY = "flames-form-builder-state";

export function getSavedForms(): SavedForm[] {
  try {
    const raw = localStorage.getItem(SAVED_FORMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveFormToList(snapshot: FormBuilderSnapshot): SavedForm {
  const forms = getSavedForms();
  const now = new Date().toISOString();

  // Check if a form with this title already exists — update it
  const existingIndex = forms.findIndex(
    (f) => f.snapshot.formTitle === snapshot.formTitle
  );

  if (existingIndex !== -1) {
    const updated = { ...forms[existingIndex], snapshot, updatedAt: now };
    forms[existingIndex] = updated;
    localStorage.setItem(SAVED_FORMS_KEY, JSON.stringify(forms));
    return updated;
  }

  const newEntry: SavedForm = {
    id: crypto.randomUUID(),
    snapshot,
    savedAt: now,
    updatedAt: now,
  };
  forms.unshift(newEntry);
  localStorage.setItem(SAVED_FORMS_KEY, JSON.stringify(forms));
  return newEntry;
}

export function deleteFormFromList(id: string): void {
  const forms = getSavedForms().filter((f) => f.id !== id);
  localStorage.setItem(SAVED_FORMS_KEY, JSON.stringify(forms));
}

export function updateFormInList(id: string, snapshot: FormBuilderSnapshot): void {
  const forms = getSavedForms().map((f) =>
    f.id === id
      ? { ...f, snapshot, updatedAt: new Date().toISOString() }
      : f
  );
  localStorage.setItem(SAVED_FORMS_KEY, JSON.stringify(forms));
}

export function loadFormIntoActive(snapshot: FormBuilderSnapshot): void {
  localStorage.setItem(ACTIVE_FORM_KEY, JSON.stringify(snapshot));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}