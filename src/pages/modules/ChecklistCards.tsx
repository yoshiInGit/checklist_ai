import React, { useEffect, useState } from "react";
import { CheckList,} from "../../checklist_handler/model";
import { deleteChecklist, restoreChecklists, subscribeOnChecklistsChanged, unsubscribeChecklistsChanged} from "../../checklist_handler/stateHandler";
import { UserState } from "../../auth/user";
import TaskListDialog from "./TaskListDialog";
import { calculateCompleteRate } from "../../helper/calculate";
import { ConfirmDialog } from "../common/ConfirmDialog";

const ChecklistCards: React.FC = () => {

    // ダイアログの状態管理
    const [isTaskListDialogOpen, setIsTaskListDialogOpen] = React.useState(false);
    const [activeChecklist, setActiveChecklist] = React.useState<CheckList | null>(null);
    const onCardClick = (checklist: CheckList) => {
        setActiveChecklist(checklist); 
        setIsTaskListDialogOpen(true);
  }

    const [checklist, setChecklist] = React.useState<CheckList[]>([]);
    
    // タスク一覧を取得する
    useEffect(() => {
        const fetchCheckList = async () => {
          setChecklist([]); // 初期化

            try {
                await restoreChecklists();
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };

        
        UserState.getInstance().subscribeAuthStateChange(fetchCheckList);
        
        // ログイン後に処理されるように
        fetchCheckList();

        return () => {
            UserState.getInstance().unsubscribeAuthStateChange(fetchCheckList);
        }

    },[]);

    // タスク一覧を更新
    useEffect(() => {
      const onChecklistsChanged = (checklists : CheckList[]) => {
        setChecklist([...checklists]);
      }

      subscribeOnChecklistsChanged(onChecklistsChanged)

      return () => {
        unsubscribeChecklistsChanged(onChecklistsChanged);
      }
    }, []);


  return (
    <>
    <div className="grid px-4 lg:px-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
      {checklist.map((checklist, index) => (
        <StylishCard 
          key={index}
          uuid={checklist.uuid} 
          title={checklist.name} 
          cardNumber={index.toString()} 
          onclick={()=>{onCardClick(checklist)}}
          completeRate={calculateCompleteRate(checklist.items)}
        />
      ))}

    {/* Todoリスト */}
    {isTaskListDialogOpen && 
      <TaskListDialog 
        onClose={()=>{setIsTaskListDialogOpen(false)}}
        checkList={activeChecklist as CheckList}
      />}
    </div>

    {/* 空の時の表示 */}
    {checklist.length===0 && 
      <div className='w-full h-screen flex items-center justify-center text-6xl text-gray-800'>
          Hello! Let's Add Task!
      </div>}

    </>
  );
};


// カード
const StylishCard = ({ 
  title = 'カードタイトル', 
  cardNumber = '0001' ,
  uuid = "",
  onclick = () => {},
  completeRate = 0,
}) => { 

  
  const [isDeleteCardDialogOpen, setIsDeleteCardDialogOpen] = useState(false);

  return (
    <>
    <div className="w-full h-40 cursor-pointer"
    onClick={onclick}>
      <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
        <div className="h-3/5 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex flex-col items-start">
          <div className="w-full flex">
            <span className="text-xs font-semibold bg-white/20 px-3 rounded-full">
              No. {cardNumber}
            </span>

            <div className="flex-grow"></div>

            <span 
              onClick={(event)=>{ event.stopPropagation();setIsDeleteCardDialogOpen(true); }}
              className="material-symbols-outlined cursor-pointer z-5" style={{fontSize : '1rem'}}>
              delete
            </span>
          </div>
          <h2 className="text-base font-bold tracking-tight pt-2">
            {title}
          </h2>
        </div>
        <div className="px-4 py-4">
            {/* 進捗バー */}
            <label className=" text-gray-600 text-sm font-semibold flex justify-end mb-1">{Math.floor(completeRate*100)}%</label>
            <div className="w-full bg-gray-300 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.floor(completeRate*100)}%` }}></div>
            </div>

            <div className="h-8"></div>
            
        </div>
      </div>
    </div>

    
      {/* 削除確認ダイアログ */}
      {isDeleteCardDialogOpen &&
        <ConfirmDialog
          title="チェックリストを削除しますか？"
          message="一度削除したチェックリストは復元できません"
          onConfirm={()=>{deleteChecklist({uuid: uuid})}}
          onClose={()=>{setIsDeleteCardDialogOpen(false)}}/>}
    </>
  );
};


export default ChecklistCards;