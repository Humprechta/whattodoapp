export enum TaskStatusEnum {
    New = 0,
    InProgress = 1,
    Done = 2,
  }

export interface ActivityModel {
    activityId: number;     // Unikátní ID aktivity
    taskId: number;         // ID úkolu, ke kterému aktivita patří
    description: string;    // Popis aktivity
    startDate?: string;     // Datum začátku (volitelné)
    endDate?: string;       // Datum ukončení (volitelné)
    createdAt: string;      // Čas vytvoření (automaticky generovaný)
    updatedAt: string;      // Čas poslední aktualizace (automaticky generovaný)
    status: TaskStatusEnum;
    name: string;
    url?: string;
  }