import { Resolver } from '@nestjs/graphql';
import { OtpsService } from './otps.service';
import { Otp } from './entities/otp.entity';

@Resolver(()=> Otp)
export class OtpsResolver {
  constructor(private readonly otpsService: OtpsService) {}
}
