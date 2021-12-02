import * as Yup from 'yup'
import Product from '../models/Products'
import Category from '../models/Category'
import User from '../models/User'
class ProductsController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (e) {
      return response.status(400).json({ error: e.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)
    if (!isAdmin) response.status(401).json()

    const { filename: path } = request.file

    const { name, price, category_id, offer } = request.body

    const product = await Product.create({
      name,
      price,
      category_id,
      path,
      offer,
    })
    return response.json(product)
  }

  async index(request, response) {
    const product = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    return response.json(product)
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (e) {
      return response.status(400).json({ error: e.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)
    if (!isAdmin) response.status(401).json()

    const { id } = request.params
    let path
    if (request.file) {
      path = request.file.filename
    }

    const product = await Product.findByPk(id)
    if (!product) {
      response.status(401).json({ error: 'Make shure your product is correct' })
    }
    const { name, price, category_id, offer } = request.body

    await Product.update(
      {
        name,
        price,
        category_id,
        path,
        offer,
      },
      {
        where: { id },
      }
    )
    return response.status(200).json()
  }
}

export default new ProductsController()
