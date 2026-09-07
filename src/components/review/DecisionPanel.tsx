"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DecisionPanelProps {
  onApprove: (comment: string) => void;
  onReject: (comment: string) => void;
  onRequestRevision: (comment: string) => void;
  disabled?: boolean;
}

export function DecisionPanel({
  onApprove,
  onReject,
  onRequestRevision,
  disabled = false,
}: DecisionPanelProps) {
  const [comment, setComment] = useState("");
  const [modalType, setModalType] = useState<
    "approve" | "reject" | "revision" | null
  >(null);

  const handleConfirm = () => {
    if (modalType === "approve") {
      onApprove(comment);
    } else if (modalType === "reject") {
      onReject(comment);
    } else if (modalType === "revision") {
      onRequestRevision(comment);
    }
    setModalType(null);
    setComment("");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        Officer Decision
      </h3>
      <div className="mb-4">
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          Decision comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add your comments regarding this decision..."
          rows={4}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="flex-1"
          onClick={() => setModalType("approve")}
          disabled={disabled}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setModalType("revision")}
          disabled={disabled}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Request Revision
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={() => setModalType("reject")}
          disabled={disabled}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={modalType === "approve"}
        onClose={() => setModalType(null)}
        title="Approve Document?"
        description="Are you sure you want to approve this document?"
      >
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setModalType(null)}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            Approve
          </Button>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={modalType === "reject"}
        onClose={() => setModalType(null)}
        title="Reject Document?"
        description="Please provide a reason for rejection."
      >
        <div className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Reason for rejection..."
            rows={3}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setModalType(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={handleConfirm}
            >
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      {/* Revision Modal */}
      <Modal
        isOpen={modalType === "revision"}
        onClose={() => setModalType(null)}
        title="Request Revision"
        description="Tell the advisor what needs to be changed."
      >
        <div className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe what needs to be revised..."
            rows={3}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setModalType(null)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleConfirm}>
              Request Revision
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
