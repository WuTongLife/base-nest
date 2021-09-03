import { SetMetadata } from '@nestjs/common';

const PERMISSION_KEY = 'permissions';
export const Permissions = (permissions: string) => SetMetadata(PERMISSION_KEY, permissions);
