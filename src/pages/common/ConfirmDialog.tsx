export const ConfirmDialog = ({ 
    onClose     = () => {}, 
    onConfirm   = () => {}, 
    title       = '確認', 
    message     = '本当によろしいですか？',
    confirmText = 'OK',
    cancelText  = 'キャンセル'
  }) => {
  
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-80 max-w-md overflow-hidden">
          {/* ヘッダー */}
          <div className="bg-gray-100 px-4 py-3 border-b">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          
          {/* 本文 */}
          <div className="px-4 py-5">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          
          {/* ボタン */}
          <div className="px-4 py-3 sm:px-6 flex justify-end space-x-3 bg-gray-50">
            <button
              type="button"
              className="cursor-pointer inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className="cursor-pointer inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };