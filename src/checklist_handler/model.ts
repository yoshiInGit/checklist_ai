export class TaskItem{
    name: string;
    completed: boolean;

    constructor(name: string, completed: boolean) {
        
        this.name = name;
        this.completed = completed;
    }
}

export class CheckList {
    uuid: string;
    name: string;
    items : TaskItem[];

    constructor(uuid: string, name: string, items: TaskItem[]) {
        this.uuid = uuid;
        this.name = name;
        this.items = items;
    }
}