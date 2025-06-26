import * as jwt from 'jsonwebtoken';

export class JwtUtil {
  static isValidAuthHeader(authorization: string) {
    const token: string = authorization.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environmet variables');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false,
    });

    return payload;
  }
}
