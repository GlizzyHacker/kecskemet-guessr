import { createParamDecorator, InternalServerErrorException } from '@nestjs/common';

export const CurrentPlayer = createParamDecorator((data, req) => {
  const user = req.switchToHttp().getRequest().user;
  if (!user) {
    throw new InternalServerErrorException('User not found in request');
  }
  return user;
});
