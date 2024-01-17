import { DataTypes } from 'sequelize'
import { sequelize } from '../database'
import { Sequelize, Model, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';

export interface LLMSingleResponseEvaluationDb extends Model<InferAttributes<LLMSingleResponseEvaluationDb>, InferCreationAttributes<LLMSingleResponseEvaluationDb>> {
    // Some fields are optional when calling UserModel.create() or UserModel.build()
    id: CreationOptional<number>;
    timestamp: CreationOptional<Date>;
    llm_response_delay_ms: CreationOptional<number>;
    llm_name: string;
    prompt_text: string;
    response_text: string;
    task_name: CreationOptional<string | null>;
    difficulty: CreationOptional<number> | null;
    is_correct: boolean | null;
    human_readable_solution: string | null;
    evaluation_message: CreationOptional<string | null>;
}

export const LLMSingleResponseEvaluationModel = sequelize.define<LLMSingleResponseEvaluationDb>('llm_response_evaluation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    llm_response_delay_ms: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    llm_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prompt_text: {
        type: DataTypes.STRING(8192),
        allowNull: false
    },
    response_text: {
        type: DataTypes.STRING(8192),
        allowNull: false
    },
    task_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    difficulty: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    human_readable_solution: {
        type: DataTypes.STRING,
        allowNull: true
    },
    evaluation_message: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {})


export default LLMSingleResponseEvaluationModel