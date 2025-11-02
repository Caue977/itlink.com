import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Volunteers table - Extended profile for volunteer users
 */
export const volunteers = mysqlTable("volunteers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio"),
  skills: text("skills"), // JSON array of skills
  availability: varchar("availability", { length: 255 }), // e.g., "weekends", "evenings", "flexible"
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  profileImage: varchar("profileImage", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Volunteer = typeof volunteers.$inferSelect;
export type InsertVolunteer = typeof volunteers.$inferInsert;

/**
 * Organizations table - Organizations that post volunteer opportunities
 */
export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  organizationName: varchar("organizationName", { length: 255 }).notNull(),
  description: text("description"),
  website: varchar("website", { length: 512 }),
  phone: varchar("phone", { length: 20 }),
  location: varchar("location", { length: 255 }),
  logo: varchar("logo", { length: 512 }),
  verified: int("verified").default(0), // 0 = not verified, 1 = verified
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;

/**
 * Opportunities table - Volunteer opportunities posted by organizations
 */
export const opportunities = mysqlTable("opportunities", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }), // e.g., "education", "health", "environment"
  location: varchar("location", { length: 255 }).notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  volunteersNeeded: int("volunteersNeeded"),
  skillsRequired: text("skillsRequired"), // JSON array of required skills
  status: mysqlEnum("status", ["active", "closed", "completed"]).default("active").notNull(),
  image: varchar("image", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = typeof opportunities.$inferInsert;

/**
 * Applications table - Volunteer applications to opportunities
 */
export const applications = mysqlTable("applications", {
  id: int("id").autoincrement().primaryKey(),
  volunteerId: int("volunteerId").notNull().references(() => volunteers.id, { onDelete: "cascade" }),
  opportunityId: int("opportunityId").notNull().references(() => opportunities.id, { onDelete: "cascade" }),
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "completed"]).default("pending").notNull(),
  coverLetter: text("coverLetter"),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
  completedAt: timestamp("completedAt"),
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;