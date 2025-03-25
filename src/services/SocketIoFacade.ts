import { getCookie } from 'cookies-next';
import { Socket, io } from 'socket.io-client';
import { AuthService } from './auth-service';
import { CookiesKey } from '@/enums/cookiesKey';

export class SocketIoFacade {
  static getSocketInstance(gateway: string): Socket {
    const auth: Record<string, string> = AuthService.isAuthorized()
      ? {
          authorization: getCookie(CookiesKey.Token) as string,
          'x-refresh-token': getCookie(CookiesKey.RefreshToken) as string,
          'x-tenant-id': process.env.NEXT_PUBLIC_PUBLIC_TENANT_ID as string,
        }
      : { 'x-tenant-id': process.env.NEXT_PUBLIC_PUBLIC_TENANT_ID as string };
    const socket: Socket = io(
      `${(process.env.NEXT_PUBLIC_BASE_API as string).replace('https', 'wss')}/${gateway}`,
      {
        withCredentials: true,
        forceNew: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        auth,
      },
    );

    return socket;
  }
}
