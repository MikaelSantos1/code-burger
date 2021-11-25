import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import AuthConfig from '../../config/auth'
class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const userEmailPassowordIncorrect = () => {
      return response
        .status(400)
        .json({ error: 'Make shure your password or email are correct' })
    }

    if (!(await schema.isValid(request.body))) userEmailPassowordIncorrect()

    const { email, password } = request.body
    const user = await User.findOne({
      where: { email },
    })

    if (!user) userEmailPassowordIncorrect()

    if (!(await user.checkPassword(password))) userEmailPassowordIncorrect()

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, AuthConfig.secret, {
        expiresIn: AuthConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
