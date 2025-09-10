CREATE TABLE `page_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`page_name` text NOT NULL,
	`config_data` text NOT NULL,
	`metadata` text,
	`user_id` text,
	`is_published` integer DEFAULT false,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `page_user_unique` ON `page_configs` (`page_name`,`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`salt` blob NOT NULL,
	`profile` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);