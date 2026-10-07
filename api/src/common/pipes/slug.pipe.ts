import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SLUG_PATTERN } from '../utils/slug.js';

/** Aceita só slugs no formato que a própria API gera; o resto é 400. */
@Injectable()
export class SlugPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string' || value.length > 80 || !SLUG_PATTERN.test(value)) {
      throw new BadRequestException('slug inválido');
    }
    return value;
  }
}
