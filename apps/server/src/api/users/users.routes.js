import express from 'express'
import crud from 'express-crud-router'
import sequelizeCrud from 'express-crud-router-sequelize-v6-connector'

import db from '../../database/models'

const User = db.User
const routes = crud('', sequelizeCrud(User))

export default routes
