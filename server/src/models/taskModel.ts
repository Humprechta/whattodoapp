import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import ActivityModel from './ActivityModel';

export enum TaskStatusEnum {
  New = 0,
  InProgress = 1,
  Done = 2,
}

// Definice rozhraní pro typovou kontrolu v TypeScriptu
interface TaskAttributes {
  taskId?: number;
  name: string;
  content: string; //description
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  status: TaskStatusEnum;
}

// Vytvoření modelu pro databázovou tabulku
class TaskModel extends Model<TaskAttributes> implements TaskAttributes {
  public taskId!: number;
  public name!: string;
  public content!: string;
  public startDate?: Date;
  public endDate?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public status!: TaskStatusEnum;
}

// Inicializace modelu v Sequelize
TaskModel.init(
  {
    taskId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: TaskStatusEnum.New, // Výchozí hodnota
      validate: {
        isIn: [[TaskStatusEnum.New, TaskStatusEnum.InProgress, TaskStatusEnum.Done]], // Validace hodnoty
      },
    },
  },
  {
    sequelize,
    tableName: 'Tasks',
    timestamps: true, // Automatické createdAt a updatedAt
  }
);


ActivityModel.belongsTo(TaskModel, {
    foreignKey: 'taskId',
    as: 'task',
    onDelete: 'CASCADE',
  });
  TaskModel.hasMany(ActivityModel, {
    foreignKey: 'taskId',
    as: 'activities',
    onDelete: 'CASCADE',
  });

export default TaskModel;
