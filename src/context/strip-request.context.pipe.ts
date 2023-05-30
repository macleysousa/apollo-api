import { Injectable, PipeTransform } from '@nestjs/common';
import { omit } from 'lodash';

import { REQUEST_CONTEXT } from '../commons/interceptors/inject-request.interceptor';

@Injectable()
export class StripRequestContextPipe implements PipeTransform {
  transform(value: any) {
    return omit(value, REQUEST_CONTEXT);
  }
}
