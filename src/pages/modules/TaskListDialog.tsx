import React, { useRef, useState } from 'react';
import { CheckList, TaskItem } from '../../checklist_handler/model';
import { removeAt } from '../../helper/array';
import { updateTasks, updateTitle } from '../../checklist_handler/stateHandler';


const TaskListDialog: React.FC<{ onClose: () => void; checkList: CheckList }> = ({ onClose, checkList }) => {
  // チェックリストのステート管理
  const [checklistName, setChecklistName] = useState<string>(checkList.name);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [titleEditText, setTitleEditText] = useState<string>('');

  // タスク管理のステート
  const [tasks, setTasks] = useState<TaskItem[]>([...checkList.items]);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // チェックリストのタイトルを編集する
  const editChecklistTitle = (): void => {
    setTitleEditText(checklistName);
    setIsEditingTitle(true);
  };

  // チェックリストのタイトルを更新する
  const updateChecklistTitle = (): void => {
    if (titleEditText.trim()) {
      setChecklistName(titleEditText.trim());
      setIsEditingTitle(false);
      
      updateTitle({uuid : checkList.uuid, title : titleEditText.trim()});
    }
  };

  // タスクの完了状態を切り替える
  const toggleTaskCompletion = (idx: number): void => {
    if (!isEditing) {
      tasks[idx].completed = !tasks[idx].completed;
      setTasks([...tasks]);
      updateTasks({uuid : checkList.uuid, tasks: tasks});
    }
  };

  // 編集モードを切り替える
  const toggleEditMode = (): void => {
    if(isEditing==true){
      updateTasks({uuid : checkList.uuid, tasks: tasks})
    }

    setIsEditing(!isEditing);

  };

  // タスクを削除する
  const deleteTask = (idx: number): void => {
    setTasks([...removeAt(tasks, idx)])
  };

  // 新しいタスクを追加する
  const newTaskTextInputRef = useRef<HTMLInputElement | null>(null);
  const addTask = (): void => {
    const newTaskText = newTaskTextInputRef.current?.value ?? "";

    if (newTaskText.trim()) {
      const newTask = new TaskItem(newTaskText.trim(), false);
      
      setTasks([...tasks, newTask]);

      //リセット
      if (newTaskTextInputRef.current) {
        newTaskTextInputRef.current.value = "";
      }
    }
  };

  //タスクの移動
  const moveTaskUp = (idx: number) => {
    if (idx <= 0) return;
    const newTasks = [...tasks];
    [newTasks[idx - 1], newTasks[idx]] = [newTasks[idx], newTasks[idx - 1]];
    setTasks([...newTasks])
  }

  const  moveTaskDown = (idx: number) =>{
    if (idx >= tasks.length - 1) return;
    const newTasks = [...tasks];
    [newTasks[idx], newTasks[idx + 1]] = [newTasks[idx + 1], newTasks[idx]];
    setTasks([...newTasks]);
  }

  // 進捗率を計算する
  const progressPercentage: number = tasks.length > 0 
    ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)
    : 0;


  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70'>
      <div className="w-4/5 max-w-lg mx-auto h-5/6 overflow-scroll bg-white shadow-lg rounded-lg p-4">
        
        <div className="w-full flex justify-end mb-4 cursor-pointer" onClick={onClose}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>
              close
            </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          {/* チェックリストタイトル */}
          {isEditingTitle ? (
            <div className="flex items-center space-x-2 w-full">
              <input
                type="text"
                value={titleEditText}
                onChange={(e) => setTitleEditText(e.target.value)}
                className="flex-grow border rounded px-2 py-1"
              />
              <button 
                onClick={updateChecklistTitle}
                className="text-green-600 hover:bg-green-100 p-2 rounded flex items-center"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.4rem' }}>
                  check
                </span>
              </button>
            </div>
          ) : (
            <h2 
              onClick={!isEditing ? editChecklistTitle : undefined}
              className={`text-xl font-bold text-gray-800 ${
                !isEditing ? 'cursor-pointer hover:text-gray-600' : ''
              }`}
            >
              {checklistName}
            </h2>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">タスク数: {tasks.length}</span>
            <button 
              onClick={toggleEditMode}
              className={`p-2 rounded transition-colors flex items-center cursor-pointer`}>
              {isEditing ? <span className="material-symbols-outlined" style={{fontSize:'1.4rem'}}>
                  check
                </span> 
                : <span className="material-symbols-outlined" style={{fontSize:'1.4rem'}}>edit</span>}
              
            </button>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="mb-10 bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* タスクリスト */}
        <div className="space-y-2 mb-4">
          {tasks.map((task, idx) => (
              <div 
                key={idx} 
                className="flex items-center space-x-2 relative mb-6"
              >
                {/* チェックボックス */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(idx)}
                  disabled={isEditing}
                  className={`form-checkbox h-5 w-5 text-blue-600 ${
                    task.completed ? 'opacity-50' : ''
                  } ${isEditing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                />

                <div className="flex-grow">
                  {tasks[idx].name}
                </div>

                {isEditing && <div className="flex flex-col">
                  <span className="material-symbols-outlined cursor-pointer" style={{ fontSize: '1.4rem' }}
                    onClick={()=>{moveTaskUp(idx)}}>
                    arrow_drop_up
                  </span>
                  <span className="material-symbols-outlined cursor-pointer" style={{ fontSize: '1.4rem' }}
                    onClick={()=>{moveTaskDown(idx)}}>
                    arrow_drop_down
                  </span>
                </div>}

                {/* 編集モード時の削除ボタン */}
                {isEditing && (
                  <button 
                    onClick={() => deleteTask(idx)}
                    className="cursor-pointer flex items-center p-2 rounded"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>
                      delete
                    </span>
                  </button>
                )}
              </div>
          ))}
        </div>

        {/* 編集モード時の新規タスク追加 */}
        {isEditing && (
          <div className="flex items-center space-x-2 mb-4">
            <input
              ref={newTaskTextInputRef}
              type="text"
              placeholder="新しいタスクを追加"
              className="flex-grow border rounded px-2 py-1"
            />
            <button 
              onClick={addTask}
              className="text-green-600 hover:bg-green-100 p-2 rounded"
            >
              ＋
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskListDialog;