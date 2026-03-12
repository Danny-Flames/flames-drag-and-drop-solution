import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Input, Select, Checkbox, Radio, Rate, Button, Divider, Tag } from 'antd';
import { RootState } from '../../redux/store/store';
import { FormField, FormSection, FormBuilderSnapshot } from '../../redux/store/slices/formBuilderSlice';
import './PreviewModal.scss';
import { AiOutlineEye } from 'react-icons/ai';

const { TextArea } = Input;
const { Option } = Select;

interface PreviewFieldProps {
  field: FormField;
}

const PreviewField: React.FC<PreviewFieldProps> = ({ field }) => {
  const [value, setValue] = useState<any>('');

  const renderInput = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            placeholder={field.placeholder || `Enter ${field.label}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      case 'textarea':
        return (
          <TextArea
            placeholder={field.placeholder || `Enter ${field.label}`}
            rows={3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder || '0'}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      case 'date':
        return <Input type="date" value={value} onChange={(e) => setValue(e.target.value)} />;
      case 'select':
        return (
          <Select
            placeholder="Select an option"
            style={{ width: '100%' }}
            value={value || undefined}
            onChange={setValue}
          >
            {field.options?.map((opt, i) => (
              <Option key={i} value={opt}>{opt}</Option>
            ))}
          </Select>
        );
      case 'radio':
        return (
          <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
            {field.options?.map((opt, i) => (
              <Radio key={i} value={opt} style={{ display: 'block', marginBottom: 4 }}>
                {opt}
              </Radio>
            ))}
          </Radio.Group>
        );
      case 'checkbox':
        return (
          <Checkbox.Group
            value={value || []}
            onChange={setValue}
            options={field.options?.map((opt) => ({ label: opt, value: opt }))}
            style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
          />
        );
      case 'rating':
        return <Rate value={value} onChange={setValue} />;
      case 'file':
      case 'image':
        return (
          <div className="preview-file-upload">
            <label className="file-upload-label">
              <input
                type="file"
                accept={field.type === 'image' ? 'image/*' : '*'}
                style={{ display: 'none' }}
              />
              <Button>{field.type === 'image' ? '🖼 Choose Image' : '📎 Choose File'}</Button>
            </label>
            <span className="file-hint">or drag and drop here</span>
          </div>
        );
      case 'address':
        return (
          <div className="address-inputs">
            <Input placeholder="Street address" style={{ marginBottom: 8 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Input placeholder="City" />
              <Input placeholder="State" style={{ width: 120 }} />
              <Input placeholder="ZIP" style={{ width: 90 }} />
            </div>
          </div>
        );
      case 'signature':
        return (
          <div className="preview-signature-box">
            <p>✍️ Click to sign</p>
          </div>
        );
      default:
        return (
          <Input
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="preview-field">
      <label className="preview-field-label">
        {field.label}
        {field.required && <span className="preview-required">*</span>}
      </label>
      {field.description && <p className="preview-field-desc">{field.description}</p>}
      {renderInput()}
    </div>
  );
};

const PreviewSection: React.FC<{ section: FormSection }> = ({ section }) => (
  <div className="preview-section">
    <h3 className="preview-section-title">{section.title}</h3>
    <Divider style={{ margin: '8px 0 16px' }} />
    {section.fields.length === 0 ? (
      <p className="preview-empty-section">No fields in this section</p>
    ) : (
      section.fields.map((field) => <PreviewField key={field.id} field={field} />)
    )}
  </div>
);

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  snapshotOverride?: FormBuilderSnapshot;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, snapshotOverride }) => {
  const { present } = useSelector((state: RootState) => state.formBuilder);
  const { formTitle, sections, formSettings } = snapshotOverride ?? present;

  const totalFields = sections.reduce((acc, s) => acc + s.fields.length, 0);
  const requiredFields = sections.reduce(
    (acc, s) => acc + s.fields.filter((f) => f.required).length,
    0
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={
        <div className="preview-modal-title">
          <span><AiOutlineEye size={18} /> Form Preview</span>
          <div className="preview-meta">
            <Tag color="blue">{sections.length} sections</Tag>
            <Tag color="green">{totalFields} fields</Tag>
            {requiredFields > 0 && <Tag color="red">{requiredFields} required</Tag>}
          </div>
        </div>
      }
      footer={
        <div className="preview-footer">
          {formSettings.allowDraft && (
            <Button onClick={onClose}>Save as Draft</Button>
          )}
          <Button type="primary" onClick={onClose}>
            {formSettings?.submitButton || 'Submit'}
          </Button>
        </div>
      }
      width={700}
      className="preview-modal"
      centered
    >
      <div className="preview-content">
        <h2 className="preview-form-title">{formTitle}</h2>

        {sections.length === 0 ? (
          <div className="preview-no-content">
            <p>🧩 Your form has no sections yet. Add sections and fields to see a preview.</p>
          </div>
        ) : (
          sections.map((section) => <PreviewSection key={section.id} section={section} />)
        )}
      </div>
    </Modal>
  );
};

export default PreviewModal;