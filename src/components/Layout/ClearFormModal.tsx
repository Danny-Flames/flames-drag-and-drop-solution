import React from "react";
import { Modal, Button } from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import "./ClearFormModal.scss";

interface ClearFormModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ClearFormModal: React.FC<ClearFormModalProps> = ({ open, onConfirm, onCancel }) => {
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

        <h3 className="clear-modal-title">Clear Entire Form?</h3>
        <p className="clear-modal-description">
          This will permanently remove all sections and fields you've built.
          This action <strong>cannot be undone</strong> after the page is refreshed.
        </p>

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
          >
            Yes, Clear Form
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClearFormModal;