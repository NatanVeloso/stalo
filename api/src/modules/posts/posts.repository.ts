import { Injectable } from '@nestjs/common';
import { and, desc, eq, gte, isNull, lt, notInArray, sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service.js';
import {
  posts,
  postMedia,
  type NewPostMediaRow,
  type NewPostRow,
  type PostMediaRow,
  type PostRow,
} from '../../database/schema.js';

@Injectable()
export class PostsRepository {
  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  /** Publicações visíveis, da mais recente para a mais antiga; pede uma a mais para saber se há próxima página. */
  listPublished(limit: number, before?: string): PostRow[] {
    const visible = isNull(posts.removedAt);
    return this.db
      .select()
      .from(posts)
      .where(before ? and(visible, lt(posts.publishedAt, before)) : visible)
      .orderBy(desc(posts.publishedAt))
      .limit(limit + 1)
      .all();
  }

  findBySlug(slug: string): (PostRow & { media: PostMediaRow[] }) | undefined {
    return this.db.query.posts
      .findFirst({
        where: and(eq(posts.slug, slug), isNull(posts.removedAt)),
        with: { media: true },
      })
      .sync();
  }

  countPublished(): number {
    return (
      this.db
        .select({ n: sql<number>`count(*)` })
        .from(posts)
        .where(isNull(posts.removedAt))
        .get()?.n ?? 0
    );
  }

  slugTaken(slug: string, exceptId: string): boolean {
    const row = this.db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get();
    return Boolean(row && row.id !== exceptId);
  }

  /** Cria ou atualiza a publicação e troca as mídias dela, tudo numa transação. */
  upsert(post: NewPostRow, media: NewPostMediaRow[]): void {
    this.db.transaction((tx) => {
      const { id, ...rest } = post;
      tx.insert(posts)
        .values(post)
        .onConflictDoUpdate({ target: posts.id, set: { ...rest, removedAt: null } })
        .run();
      tx.delete(postMedia).where(eq(postMedia.postId, id)).run();
      if (media.length) tx.insert(postMedia).values(media).run();
    });
  }

  /**
   * Marca como removidas as publicações dentro da janela sincronizada que não
   * vieram mais do Instagram. Fora da janela (mais antigas que `since`) não dá
   * para saber, então ficam como estão.
   */
  markRemovedNotIn(seenIds: string[], since: string): string[] {
    if (!seenIds.length) return [];
    const rows = this.db
      .update(posts)
      .set({ removedAt: new Date().toISOString() })
      .where(and(isNull(posts.removedAt), gte(posts.publishedAt, since), notInArray(posts.id, seenIds)))
      .returning({ id: posts.id })
      .all();
    return rows.map((r) => r.id);
  }
}
