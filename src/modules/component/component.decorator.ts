import { SetMetadata } from '@nestjs/common';
import { ComponentEntity } from './entities/component.entity';

export const components: ComponentEntity[] = new Array<ComponentEntity>();

export const COMPONENT_KEY = 'component_key';
export const COMPONENT_DESC = 'component_desc';

export const ApiComponent = (component: string, describe: string, deprecated = false) => {
    components.push({ id: component, name: describe, deprecated: deprecated });
    SetMetadata(COMPONENT_DESC, describe);
    return SetMetadata(COMPONENT_KEY, component);
};
