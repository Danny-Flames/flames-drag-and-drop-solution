import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Input, Select, Checkbox, Radio, Button, Popconfirm, Rate } from 'antd';
import { FiEdit3, FiTrash2, FiSettings } from 'react-icons/fi';
import { BsGripVertical } from 'react-icons/bs';
import { FormField as FormFieldType, updateField, deleteField, setSelectedField } from '../../redux/store/slices/formBuilderSlice';
import { RootState } from '../../redux/store/store';
import './FormField.scss';

const { TextArea } = Input;
const { Option } = Select;

interface FormFieldProps {
  field: FormFieldType;
  sectionId: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, sectionId }) => {
  const dispatch = useDispatch();
  const selectedField = useSelector((state: RootState) => state.formBuilder.selectedField);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [tempLabel, setTempLabel] = useState(field.label);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: { type: field.type, label: field.label, isNewField: false },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const isSelected = selectedField === field.id;

  const handleLabelSave = () => {
    if (tempLabel.trim()) {
      dispatch(updateField({ sectionId, fieldId: field.id, updates: { label: tempLabel.trim() } }));
    } else {
      setTempLabel(field.label);
    }
    setIsEditingLabel(false);
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return <Input placeholder={field.placeholder} disabled className="field-preview" />;
      case 'textarea':
        return <TextArea placeholder={field.placeholder} disabled rows={3} className="field-preview" />;
      case 'number':
        return <Input type="number" placeholder={field.placeholder} disabled className="field-preview" />;
      case 'date':
        return <Input type="date" disabled className="field-preview" />;
      case 'select':
        return (
          <Select placeholder="Select an option" disabled className="field-preview" style={{ width: '100%' }}>
            {field.options?.map((opt, i) => <Option key={i} value={opt}>{opt}</Option>)}
          </Select>
        );
      case 'radio':
        return (
          <Radio.Group disabled className="field-preview">
            {field.options?.map((opt, i) => <Radio key={i} value={opt} className="radio-option">{opt}</Radio>)}
          </Radio.Group>
        );
      case 'checkbox':
        return (
          <div className="field-preview checkbox-group">
            {field.options?.map((opt, i) => <Checkbox key={i} disabled className="checkbox-option">{opt}</Checkbox>)}
          </div>
        );
      case 'rating':
        return <Rate disabled className="field-preview" />;
      case 'file':
      case 'image':
        return (
          <div className="file-upload-preview">
            <Button disabled>{field.type === 'image' ? '🖼 Choose Image' : '📎 Choose File'}</Button>
            <span className="file-text">No file chosen</span>
          </div>
        );
      case 'address':
        return (
          <div className="address-preview">
            <Input placeholder="Street address" disabled className="field-preview" style={{ marginBottom: 6 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Input placeholder="City" disabled className="field-preview" />
              <Input placeholder="ZIP" disabled className="field-preview" style={{ width: 100 }} />
            </div>
          </div>
        );
      case 'signature':
        return (
          <div className="signature-preview">
            <div className="signature-box">✍️ Signature area</div>
          </div>
        );
      default:
        return <Input placeholder={field.placeholder} disabled className="field-preview" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`form-field-container ${isSelected ? 'selected' : ''} ${isDragging ? 'is-dragging' : ''}`}
      onClick={() => dispatch(setSelectedField(field.id))}
    >
      <Card className="form-field-card" size="small">
        <div className="field-header">
          <div className="field-drag-handle" {...listeners}>
            <BsGripVertical />
          </div>

          <div className="field-label-area">
            {isEditingLabel ? (
              <Input
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                onPressEnter={handleLabelSave}
                onBlur={handleLabelSave}
                autoFocus
                size="small"
                className="label-input"
              />
            ) : (
              <div className="field-label" onClick={(e) => { e.stopPropagation(); setIsEditingLabel(true); }}>
                <span className="label-text">
                  {field.label}
                  {field.required && <span className="required-star">*</span>}
                </span>
                <FiEdit3 className="edit-icon" />
              </div>
            )}
          </div>

          <div className="field-actions">
            <Checkbox
              checked={field.required}
              onChange={(e) => dispatch(updateField({ sectionId, fieldId: field.id, updates: { required: e.target.checked } }))}
            >
              Required
            </Checkbox>
            <Button
              type="text" size="small" icon={<FiSettings />}
              onClick={(e) => { e.stopPropagation(); dispatch(setSelectedField(field.id)); }}
            />
            <Popconfirm
              title="Delete Field"
              description="Are you sure you want to delete this field?"
              onConfirm={() => dispatch(deleteField({ sectionId, fieldId: field.id }))}
              okText="Delete" cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger size="small" icon={<FiTrash2 />} onClick={(e) => e.stopPropagation()} />
            </Popconfirm>
          </div>
        </div>

        <div className="field-content">{renderFieldPreview()}</div>
      </Card>
    </div>
  );
};

export default FormField;
