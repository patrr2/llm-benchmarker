import { Sequelize, DataTypes } from 'sequelize'
import { postgresConnectionString } from '../config'

export const sequelize = new Sequelize(postgresConnectionString);

export const databaseReady = sequelize.sync({ force: false })