import { CookiesKey } from '@/enums/cookiesKey';
import { queryClient } from '@/providers/queryClientProvider';
import { deleteCookie, setCookie, hasCookie } from 'cookies-next';

export class AuthService {
  static isAuthorized(): boolean {
    return hasCookie(CookiesKey.IsAuthorized) as boolean;
  }

  static setAsAuthorized(): void {
    setCookie(CookiesKey.IsAuthorized, true, {
      maxAge: parseInt(
        process.env.NEXT_PUBLIC_JWT_EXPIRE_SECONDS as unknown as string,
      ),
      secure: true,
      sameSite: 'strict',
    });
  }


  static setAsUnauthorized(): void {
    deleteCookie(CookiesKey.IsAuthorized);
    deleteCookie(CookiesKey.Token);
    deleteCookie(CookiesKey.RefreshToken);
  }

  static refreshAuthorization() {
    if (AuthService.isAuthorized()) {
      AuthService.setAsAuthorized();
    }
  }

  static logOut(): void {
    AuthService.setAsUnauthorized();
    queryClient.removeQueries();
    localStorage.clear();
  }
}
