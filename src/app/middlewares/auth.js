import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
export default (request, response, next) => {
  const authToken = request.headers.authorization
  if (!authToken) response.status(400).json({ error: 'Token not provide' })
  const token = authToken.split(' ')[1]
  try {
    jwt.verify(token, authConfig.secret, function (err, decoded) {
      if (err) {
        throw new Error()
      }
      console.log(decoded)
      request.userId = decoded.id
      request.userName = decoded.name
      return next()
    })
  } catch (e) {
    console.log(e)
    return response.status(401).json({ error: 'Token is invalid' })
  }
}
