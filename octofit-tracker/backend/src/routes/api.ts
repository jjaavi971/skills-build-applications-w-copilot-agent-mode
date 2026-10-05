import { Router } from 'express'
import type { Model } from 'mongoose'
import apiUrl from '../config/apiUrl.js'
import { Activity, Leaderboard, Team, User, Workout } from '../models/index.js'

const apiRouter = Router()

function createResourceRouter<T>(resourceModel: Model<T>) {
  const resourceRouter = Router()

  resourceRouter.get('/', async (_request, response) => {
    response.json(await resourceModel.find().lean())
  })

  resourceRouter.post('/', async (request, response) => {
    response.status(201).json(await resourceModel.create(request.body))
  })

  return resourceRouter
}

apiRouter.get('/health', (_request, response) => {
  response.json({ status: 'ok', service: 'octofit-tracker-api', apiUrl })
})

apiRouter.use('/users', createResourceRouter(User))
apiRouter.use('/teams', createResourceRouter(Team))
apiRouter.use('/activities', createResourceRouter(Activity))
apiRouter.use('/leaderboard', createResourceRouter(Leaderboard))
apiRouter.use('/workouts', createResourceRouter(Workout))

export default apiRouter