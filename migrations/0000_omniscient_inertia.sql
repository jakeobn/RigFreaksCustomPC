CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"handle" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text,
	"author" text NOT NULL,
	"image_url" text,
	"tags" text[],
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "build_components" (
	"build_id" integer NOT NULL,
	"component_id" integer NOT NULL,
	"component_type" text NOT NULL,
	CONSTRAINT "build_components_build_id_component_id_pk" PRIMARY KEY("build_id","component_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"handle" text NOT NULL,
	"description" text,
	"image_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "collections_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "compatibility_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"component_id" integer NOT NULL,
	"compatible_with" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_builds" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"total_price" numeric(10, 2) NOT NULL,
	"name" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pc_components" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"specs" jsonb NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"image_url" text,
	"in_stock" boolean DEFAULT true NOT NULL,
	"product_id" integer,
	"brand" text
);
--> statement-breakpoint
CREATE TABLE "product_collections" (
	"product_id" integer NOT NULL,
	"collection_id" integer NOT NULL,
	CONSTRAINT "product_collections_product_id_collection_id_pk" PRIMARY KEY("product_id","collection_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"handle" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"compare_at_price" numeric(10, 2),
	"category" text NOT NULL,
	"subcategory" text,
	"featured_image_url" text NOT NULL,
	"images_urls" text[],
	"tags" text[],
	"specs" jsonb NOT NULL,
	"specs_html" text,
	"stock" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "build_components" ADD CONSTRAINT "build_components_build_id_custom_builds_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."custom_builds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "build_components" ADD CONSTRAINT "build_components_component_id_pc_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."pc_components"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compatibility_rules" ADD CONSTRAINT "compatibility_rules_component_id_pc_components_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."pc_components"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_builds" ADD CONSTRAINT "custom_builds_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pc_components" ADD CONSTRAINT "pc_components_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;