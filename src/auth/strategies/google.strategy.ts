import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

import { GoogleUser } from '@auth/interfaces'
import { Profile, Strategy } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:5000/auth/google/callback',
      scope: ['email', 'profile']
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    done: (err: any, user: GoogleUser, info?: any) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const { name, emails, photos } = profile || {}
    const user: GoogleUser = {
      email: emails && emails.length > 0 ? emails[0].value : '',
      firstName: name ? name.givenName : '',
      lastName: name ? name.familyName : '',
      picture: photos && photos.length > 0 ? photos[0].value : '',
      accessToken
    }
    done(null, user)
  }
}
