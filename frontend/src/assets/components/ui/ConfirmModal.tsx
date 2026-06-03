import React from "react";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Confirm",
  message = "Are you sure?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" />
      <div className="relative z-10 w-full max-w-md border-2 border-gold-dark bg-neutral p-6">
        <h3 className="text-lg font-bold text-neutral-text">{title}</h3>
        <p className="mt-3 text-sm text-gray-light">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <PreviewActionButton
            onClick={onCancel}
            variant="secondary"
            className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
          >
            {cancelLabel}
          </PreviewActionButton>
          <PreviewActionButton
            onClick={onConfirm}
            variant="danger"
            className="!bg-dark !text-neutral-text hover:!bg-error"
          >
            {confirmLabel}
          </PreviewActionButton>
        </div>
      </div>
    </div>
  );
}
