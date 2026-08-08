CREATE TABLE "department" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "department_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" serial PRIMARY KEY NOT NULL,
	"publication_id" integer NOT NULL,
	"evidence_type" varchar(100) NOT NULL,
	"reference" varchar(500) NOT NULL,
	"verification_status" varchar(50) DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "external_author" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"affiliation" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "faculty" (
	"id" serial PRIMARY KEY NOT NULL,
	"department_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "faculty_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "publication_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "publication_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "publication" (
	"id" serial PRIMARY KEY NOT NULL,
	"publication_type_id" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"journal_or_conference" varchar(500),
	"year" integer NOT NULL,
	"doi_or_reference" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publication_author" (
	"id" serial PRIMARY KEY NOT NULL,
	"publication_id" integer NOT NULL,
	"faculty_id" integer,
	"external_author_id" integer,
	"author_order" integer NOT NULL,
	CONSTRAINT "unique_pub_faculty" UNIQUE("publication_id","faculty_id"),
	CONSTRAINT "unique_pub_external_author" UNIQUE("publication_id","external_author_id"),
	CONSTRAINT "unique_pub_order" UNIQUE("publication_id","author_order"),
	CONSTRAINT "author_type_check" CHECK ((faculty_id IS NOT NULL)::int + (external_author_id IS NOT NULL)::int = 1)
);
--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication" ADD CONSTRAINT "publication_publication_type_id_publication_type_id_fk" FOREIGN KEY ("publication_type_id") REFERENCES "public"."publication_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_author" ADD CONSTRAINT "publication_author_publication_id_publication_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publication"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_author" ADD CONSTRAINT "publication_author_faculty_id_faculty_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculty"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_author" ADD CONSTRAINT "publication_author_external_author_id_external_author_id_fk" FOREIGN KEY ("external_author_id") REFERENCES "public"."external_author"("id") ON DELETE restrict ON UPDATE no action;