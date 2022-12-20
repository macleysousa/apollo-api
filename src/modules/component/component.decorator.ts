import { SetMetadata } from '@nestjs/common';

export const COMPONENT_KEY = 'components';
export const Component = (component: string) => SetMetadata(COMPONENT_KEY, component);
