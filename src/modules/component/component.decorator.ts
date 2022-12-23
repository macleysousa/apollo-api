import { SetMetadata } from '@nestjs/common';

export const COMPONENT_KEY = 'component_key';
export const COMPONENT_DESC = 'component_desc';
export const ApiComponent = (component: string, describe: string) => {
    SetMetadata(COMPONENT_DESC, describe);
    return SetMetadata(COMPONENT_KEY, component);
};
