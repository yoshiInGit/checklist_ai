import { useState } from 'react';
import { addChecklist } from '../../checklist_handler/stateHandler';
import { requestTaskList } from '../../gemini/actions';
import { TaskItem } from '../../checklist_handler/model';


const ChecklistCreatorDialog = ( { onClose }: { onClose: () => void } ) => {
  const [prompt, setPrompt] = useState('');
  const [resultStr, setResultStr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  //作成されたタスク、タイトルのホルダー
  const [createdtasks, setCreatedTasks] = useState<string[]>([]);
  const [createdTitle, setCreatedTitle] = useState<string>("");


  // チェックリスト作成処理
  const createChecklist = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const tasksData = await requestTaskList({taskRequest : prompt.trim()});
      
      setCreatedTasks(tasksData?.taskList ?? []);
      setCreatedTitle(tasksData?.title ?? "");
      
      // レスポンスからチェックリストを表示
      console.log(tasksData)
      setResultStr(tasksData?.taskList?.map(item => `・ ${item}`).join('\n') ?? "タスクの作成に失敗しました");
    } catch(e) {
      console.log(e)
      setResultStr('エラーが発生しました。もう一度試してください。');
    } finally {
      setIsLoading(false);
    }
  };

  // チェックリストの作成ボタンが押されたときの処理
  const commitChecklist = async () => {
    if (!resultStr.trim() || resultStr==="タスクの作成に失敗しました") return;

    const taskItem = createdtasks.map((task)=>new TaskItem(task, false));
    addChecklist(createdTitle, taskItem);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 bg-opacity-50">
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl p-6 relative">
        {/* 閉じるボタン */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* タイトル */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          どんなチェックリストを作りますか？
        </h2>

        {/* プロンプト入力エリア */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="例: 週末の旅行準備、プロジェクト立ち上げ、引っ越しチェックリストなど"
          className="w-full min-h-[40px] p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors mb-4"
        />

        {/* ボタンエリア */}
        <div className="flex space-x-2 mb-4">
          <button 
            onClick={createChecklist} 
            disabled={isLoading || !prompt.trim()}
            className={`flex-grow py-2 rounded-lg text-white transition-colors cursor-pointer ${
              isLoading || !prompt.trim() 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? '作成中...' : 'チェックリスト作成'}
          </button>
        </div>

        {/* 結果表示エリア */}
        {resultStr && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-80 overflow-scroll">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">チェックリスト結果:</h3>
            <pre className="whitespace-pre-wrap text-gray-700">{resultStr}</pre>
          </div>
        )}

        {resultStr && <div className="w-full flex justify-end mt-6">
            <button 
                onClick={commitChecklist}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md mr-2 cursor-pointer"
            >
                作成
            </button>       
        </div>}
      </div>
    </div>
  );
};

export default ChecklistCreatorDialog;