import { ActivityModel } from "./ActivityModel";

export enum TaskStatusEnum {
    New = 0,
    InProgress = 1,
    Done = 2,
  }
export interface TaskModel {
    taskId: number;       // Unikátní ID úkolu
    name: string;         // Název úkolu
    content: string;      // Popis úkolu
    startDate?: string;   // Datum začátku (volitelné)
    endDate?: string;     // Datum ukončení (volitelné)
    createdAt: string;    // Čas vytvoření (automaticky generovaný)
    updatedAt: string;    // Čas poslední aktualizace (automaticky generovaný)
    status: TaskStatusEnum;
    activities?: ActivityModel[]; // Pole aktivit patřících k úkolu
}