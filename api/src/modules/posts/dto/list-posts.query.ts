import { Type } from 'class-transformer';
import { IsInt, IsISO8601, IsOptional, Max, Min } from 'class-validator';

/** GET /api/posts?limit=12&before=2026-10-01T12:00:00.000Z (paginação por cursor de data). */
export class ListPostsQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  limit = 12;

  /** devolve só publicações anteriores a esta data (o `nextCursor` da página anterior) */
  @IsOptional()
  @IsISO8601()
  before?: string;
}
