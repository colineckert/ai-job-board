import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelpers";
import { UserTable } from "./user";
import { JobListingTable } from "./jobListing";

export const applicationStages = [
  "denied",
  "applied",
  "interested",
  "interviewed",
  "hired",
] as const;
export type ApplicationStage = (typeof applicationStages)[number];
export const applicationStageEnum = pgEnum(
  "job_listing_application_stage",
  applicationStages,
);

// NOTE: primary key for application stage is a combination of jobListingId and userId
// and when job listing or user is deleted, the application should also be deleted
export const JobListingApplicationTable = pgTable(
  "job_listing_applications",
  {
    jobListingId: uuid()
      .references(() => JobListingTable.id, { onDelete: "cascade" })
      .notNull(),
    userId: varchar()
      .references(() => UserTable.id, { onDelete: "cascade" })
      .notNull(),
    coverLetter: varchar(),
    rating: integer(),
    stage: applicationStageEnum().notNull().default("applied"),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.jobListingId, table.userId] })],
);
