import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore"; 
import { db } from "../firebase";
import { CheckList, TaskItem } from "./model";
import { formatTaskList, parseTaskList } from "./helper";
import { UserState } from "../auth/user";
import { v4 as uuidv4 } from 'uuid';
import { removeWhere } from "../helper/array";


let checklists : CheckList[] = [];

// command系
export const addChecklist = async (name: string, taskItems: TaskItem[]) => {
    const user = UserState.getInstance().getUser();
    if (!user) {
        console.error("User is null");
        return;
    }

    try {
        const uuid = uuidv4();
        await setDoc(doc(db, 'users', user.uid, 'checklists', uuid), {
            name,
            task_items: formatTaskList(taskItems),
        });

        console.log("Document written with ID:", uuid);

        checklists.push(new CheckList(uuid, name, taskItems));
        notifyChecklistChanged();

    } catch (error) {
        console.error("Error writing document:", error);
    }
};

export const deleteChecklist = async ({uuid} : {uuid:string})=>{
    const user = UserState.getInstance().getUser();
    if (!user) {
        console.error("User is null");
        return;
    }

    await deleteDoc(doc(db, 'users', user.uid, 'checklists', uuid));

    checklists = removeWhere(checklists, (item)=>item.uuid===uuid);

    notifyChecklistChanged();
}

export const updateTitle = async ({uuid, title} : {uuid : string, title :string}) => {
    
    const user = UserState.getInstance().getUser();
    if (!user) {
        console.error("User is null");
        return;
    }

    const checklistRef = doc(db, 'users', user.uid, 'checklists', uuid);
    await updateDoc(checklistRef, {
        name : title
    });

    const targetChecklist = checklists.find(checklist => checklist.uuid===uuid);
    if (targetChecklist) {
        targetChecklist.name = title;
    }


    notifyChecklistChanged();
}

export const updateTasks = async({uuid, tasks} : {uuid :string, tasks : TaskItem[]})=> {
    
    const user = UserState.getInstance().getUser();
    if (!user) {
        console.error("User is null");
        return;
    }

    const checklistRef = doc(db, 'users', user.uid, 'checklists', uuid);
    await updateDoc(checklistRef, {
        task_items: formatTaskList(tasks),
    });

    const targetChecklist = checklists.find(checklist => checklist.uuid===uuid);
    if (targetChecklist) {
        targetChecklist.items = tasks;
    }

    notifyChecklistChanged();
}



// query系
export const restoreChecklists = async () => {
    // 初期化

    const user = UserState.getInstance().getUser();
    if(user!=null){
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'checklists'));
        console.log("firebase call");
        
        checklists = [];
        querySnapshot.forEach((doc) => {
            checklists.push(
                new CheckList(doc.id, doc.data().name, parseTaskList(doc.data().task_items))
            );
        });
    }

    notifyChecklistChanged();
}


// watch系
const onChecklistChangedCallbacks: ((checklist: CheckList[]) => void)[] = [];

const notifyChecklistChanged = () => {
    console.log("notifyChecklistChanged");
    onChecklistChangedCallbacks.forEach((callback) => { 
        callback(checklists);
    });
}   

export const subscribeOnChecklistsChanged = (callback: (checklist: CheckList[]) => void): void => {
    onChecklistChangedCallbacks.push(callback);
}

export const unsubscribeChecklistsChanged = (callback: (checklist: CheckList[]) => void): void => {
    const index = onChecklistChangedCallbacks.indexOf(callback);
    if (index !== -1) {
        onChecklistChangedCallbacks.splice(index, 1);
    }
};