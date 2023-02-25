import express from 'express'
import crud from 'express-crud-router'
import sequelizeCrud from 'express-crud-router-sequelize-v6-connector'

import db from '../../database/models'

const Rating = db.Rating
const routes = crud('', sequelizeCrud(Rating))

export default routes
