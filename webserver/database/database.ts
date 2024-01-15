import { Sequelize, DataTypes } from 'sequelize'

const postgresConnectionString = process.env.POSTGRES_CONN_STRING || 'postgres://postgres:postgres@localhost:5432/postgres'

export const sequelize = new Sequelize(postgresConnectionString);

export const databaseReady = sequelize.sync({ force: false })