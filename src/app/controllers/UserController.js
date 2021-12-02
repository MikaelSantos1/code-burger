import { v4 } from 'uuid'
import * as Yup from 'yup'
import User from '../models/User'
class UseController {
  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6).max(12),
      admin: Yup.boolean(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (e) {
      return response.status(400).json({ error: e.errors })
    }

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Make shure your data is correct' })
    }

    const { name, email, password, admin } = request.body

    const userExist = await User.findOne({
      where: { email },
    })
    if (userExist)
      return response.status(409).json({ error: 'email already exists' })

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    })

    return response.status(201).json({ id: user.id, name, email })
  }
}
export default new UseController()
