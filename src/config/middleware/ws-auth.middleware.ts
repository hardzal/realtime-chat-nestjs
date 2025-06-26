/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Socket } from 'socket.io';
import { JwtUtil } from '../util/jwt.util';

export function wsAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const { authorization } = socket.handshake.headers;

    if (!authorization) {
      throw new Error('No Authorization header');
    }

    socket.data.user = JwtUtil.isValidAuthHeader(authorization);
    return next();
  } catch (error) {
    socket.emit('error', error);

    return next(error);
  }
}
