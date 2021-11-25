import * as Yup from 'yup'
import Product from '../models/Products'
import Category from '../models/Category'
import Order from '../schemas/Order'
import User from '../models/User'

class OrderController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (e) {
      return response.status(400).json({ error: e.errors })
    }
    const productsId = request.body.products.map((product) => product.id)
    const orderProducts = await Product.findAll({
      where: {
        id: productsId,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    })
    const editProducts = orderProducts.map((product) => {
      const productsIndex = request.body.products.findIndex(
        (requestProducts) => requestProducts.id === product.id
      )

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: request.body.products[productsIndex].quantity,
      }
      return newProduct
    })
    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: editProducts,
      status: 'Pedido realizado',
    }
    const orderResponse = await Order.create(order)
    return response.status(201).json(orderResponse)
  }

  async index(request, response) {
    const order = await Order.find()
    return response.json(order)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
    })
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (e) {
      return response.status(400).json({ error: e.errors })
    }
    const { admin: isAdmin } = await User.findByPk(request.userId)
    if (!isAdmin) response.status(401).json()

    const { id } = request.params
    const { status } = request.body
    try {
      await Order.updateOne({ _id: id }, { status })
    } catch (e) {
      return response.status(400).json({ error: e.message })
    }

    return response.json({ message: 'Status updated sucessfully!' })
  }
}
export default new OrderController()
