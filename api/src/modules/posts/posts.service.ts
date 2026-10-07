import { Injectable, NotFoundException } from '@nestjs/common';
import type { ListPostsQuery } from './dto/list-posts.query.js';
import type { PostDetailResponse, PostListResponse } from './dto/post.response.js';
import { toDetail, toSummary } from './post.mapper.js';
import { PostsRepository } from './posts.repository.js';

@Injectable()
export class PostsService {
  constructor(private readonly repo: PostsRepository) {}

  list(query: ListPostsQuery): PostListResponse {
    const rows = this.repo.listPublished(query.limit, query.before);
    const page = rows.slice(0, query.limit);
    const hasMore = rows.length > query.limit;
    return {
      items: page.map(toSummary),
      nextCursor: hasMore ? page[page.length - 1].publishedAt : null,
    };
  }

  getBySlug(slug: string): PostDetailResponse {
    const row = this.repo.findBySlug(slug);
    if (!row) throw new NotFoundException('Publicação não encontrada');
    return toDetail(row);
  }
}
