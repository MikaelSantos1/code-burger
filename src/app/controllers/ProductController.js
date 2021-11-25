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
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (e) {
      return response.status(400).json({ error: e.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)
    if (!isAdmin) response.status(401).json()

    const { filename: path } = request.file
    const { name, price, category_id } = request.body
    const product = await Product.create({
      name,
      price,
      category_id,
      path,
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
}

export default new ProductsController()
