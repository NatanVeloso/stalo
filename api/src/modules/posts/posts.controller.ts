import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { SlugPipe } from '../../common/pipes/slug.pipe.js';
import { ListPostsQuery } from './dto/list-posts.query.js';
import type { PostDetailResponse, PostListResponse } from './dto/post.response.js';
import { PostsService } from './posts.service.js';

/** Leitura pública do blog. Cache curto: a sync roda de hora em hora. */
@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  list(@Query() query: ListPostsQuery): PostListResponse {
    return this.posts.list(query);
  }

  @Get(':slug')
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  bySlug(@Param('slug', SlugPipe) slug: string): PostDetailResponse {
    return this.posts.getBySlug(slug);
  }
}
