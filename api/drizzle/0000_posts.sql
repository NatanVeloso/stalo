CREATE TABLE `post_media` (
	`id` text PRIMARY KEY NOT NULL,
	`post_id` text NOT NULL,
	`position` integer NOT NULL,
	`media_type` text NOT NULL,
	`path` text,
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `post_media_post_idx` ON `post_media` (`post_id`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`excerpt` text NOT NULL,
	`body` text NOT NULL,
	`caption` text NOT NULL,
	`hashtags` text DEFAULT '[]' NOT NULL,
	`media_type` text NOT NULL,
	`permalink` text NOT NULL,
	`cover_path` text,
	`like_count` integer,
	`comments_count` integer,
	`published_at` text NOT NULL,
	`synced_at` text NOT NULL,
	`removed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_published_idx` ON `posts` (`published_at`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` text NOT NULL
);
