import { GoogleGenAI } from "@google/genai";
const geminiAi = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });


interface TasksData {
    title: string;
    taskList: string[];
}


export const requestTaskList = async ({taskRequest} : {taskRequest : string}) : Promise<TasksData | null> => {
    const response = await geminiAi.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt({taskRequest : taskRequest})});

    console.log(response.text);

    return extractJsonFromText(response.text ?? "") 
}

const prompt = ({taskRequest}: {taskRequest: string}) => {
    return`
# 命令
{task_request}を遂行するための必要なチェックリスト及び短いタイトルを作成しなさい。
タスクの遂行に必要なものをMECEフレームワークで考えて推論し、最後に例に示すようにjson形式出力しなさい。

# 形式例
入力:
task_request : "some task"

出力:
推論内容...
{title:"引っ越し", taskList : "タスク1","タスク２","タスク３"}


#制限
titleに”チェックリスト”を末尾に着けないでくささい

# 変数
task_request : "${taskRequest}"
`
}


export const extractJsonFromText = (text: string): TasksData | null => {
    const match = text.match(/```json\n([\s\S]*?)\n```/);

    if (match) {
        try {
            return JSON.parse(match[1].trim()) as TasksData;
        } catch (error) {
            console.error("JSON parsing error:", error);
            return null;
        }
    }
    return null;
}