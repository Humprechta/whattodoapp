import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import TaskModel from './taskModel'; // Import TaskModel

export enum TaskStatusEnum {
    New = 0,
    InProgress = 1,
    Done = 2,
  }
// Definice rozhraní pro typovou kontrolu v TypeScriptu
interface ActivityAttributes {
    activityId?: number;
    taskId: number; // Foreign key to Task
    description: string;
    startDate?: Date;
    endDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    status: TaskStatusEnum;
    name: string;
    url?: string,
  }

class ActivityModel extends Model<ActivityAttributes> implements ActivityAttributes {
  public activityId!: number;
  public taskId!: number;
  public description!: string;
  public startDate?: Date;
  public endDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public status!: TaskStatusEnum;
  public name!: string;
  public url?: string;
}
  
ActivityModel.init(
  {
    activityId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TaskModel,
        key: 'taskId',
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: TaskStatusEnum.New, // Výchozí hodnota
          validate: {
            isIn: [[TaskStatusEnum.New, TaskStatusEnum.InProgress, TaskStatusEnum.Done]], // Validace hodnoty
          },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Activities',
    timestamps: true, // Automatické createdAt a updatedAt
  }
);

export default ActivityModel;