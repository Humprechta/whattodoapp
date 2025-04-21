interface ConfirmModalProps {
  message: string;
  secondaryMessage?: string
  onConfirm: (result: boolean) => void;
  visible: boolean
}

export default function ConfirmModal({ message, onConfirm, visible, secondaryMessage = "" }: ConfirmModalProps) {

  if (!visible) return null;

  return (
    
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="modal modal-open">
        <div className="modal-box bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-gray-800">{message}</h2>
          <p>{secondaryMessage}</p>
          <div className="flex justify-end mt-6 gap-4">
            {/* YES b. */}
            <button
              className="btn btn-sm border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white w-24 hover:border-red-300"
              onClick={() => onConfirm(true)}
            >
              Yes
            </button>
            {/* NO b. */}
            <button
              className="btn btn-sm border-2 border-black text-black bg-transparent hover:bg-gray-200 hover:text-black w-24"
              onClick={() => onConfirm(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
