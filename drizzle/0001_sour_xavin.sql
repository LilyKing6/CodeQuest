ALTER TABLE `user_stats` ADD `streak_days` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `user_stats` ADD `last_played_date` text;--> statement-breakpoint
ALTER TABLE `user_stats` ADD `daily_done_date` text;