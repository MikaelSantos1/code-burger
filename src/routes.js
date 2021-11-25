import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import ProductController from './app/controllers/ProductController'
import SessionController from './app/controllers/SessionController'
import UserController from './app/controllers/UserController'
import authMiddlweares from './app/middlewares/auth'
import CategoryController from './app/controllers/CategoryController'
import OrderController from './app/controllers/OrderController'
const upload = multer(multerConfig)
const routes = new Router()

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddlweares)
routes.get('/products', ProductController.index)
routes.post('/products', upload.single('file'), ProductController.store)

routes.post('/categories', upload.single('file'), CategoryController.store)
routes.get('/categories', upload.single('file'), CategoryController.index)
routes.put('/categories/:id', CategoryController.update)

routes.post('/orders', OrderController.store)
routes.get('/orders', OrderController.index)
routes.put('/orders/:id', OrderController.update)

export default routes
