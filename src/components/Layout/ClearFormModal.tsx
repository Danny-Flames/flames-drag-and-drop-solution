import React from "react";
import { Modal, Button } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";

interface ClearFormModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
}

const ClearFormModal: React.FC<ClearFormModalProps> = ({
  open,
  onConfirm,
  onCancel,
  title = "Clear Entire Form?",
  description = (
    <>
      This will permanently remove all sections and fields you've built. This
      action <strong>cannot be undone</strong> after the page is refreshed.
    </>
  ),
  confirmText = "Yes, Clear Form",
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      width={420}
      closable={false}
      className="clear-form-modal"
    >
      <div className="clear-modal-content">
        <div className="clear-modal-icon">
          <IoWarningOutline size={36} />
        </div>

        <h3 className="clear-modal-title">{title}</h3>
        <p className="clear-modal-description">{description}</p>

        <div className="clear-modal-actions">
          <Button className="cancel-btn" onClick={onCancel} size="large">
            Cancel
          </Button>
          <Button
            danger
            type="primary"
            size="large"
            icon={<RiDeleteBin6Line size={16} />}
            onClick={onConfirm}
            className="confirm-btn"
            style={{ marginLeft: '15px', border: 'none', outline: 'none'}}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClearFormModal;