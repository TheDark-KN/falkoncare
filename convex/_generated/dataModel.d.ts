/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  DataModelFromSchemaDefinition,
  DocumentByName,
  TableNamesInDataModel,
  SystemTableNames,
} from "convex/server";
import type { GenericId } from "convex/values";
import schema from "../schema.js";

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>;

/**
 * The type of a document stored in Convex.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Doc<TableName extends TableNames> = DocumentByName<
  DataModel,
  TableName
>;

/**
 * The Convex data model for this project.
 *
 * This type is generated from your schema definition in schema.ts.
 */
export type DataModel = DataModelFromSchemaDefinition<typeof schema>;

/**
 * The names of system tables in Convex.
 */
export type SystemTableNames = SystemTableNames;

/**
 * Generic ID type for referencing documents.
 */
export type Id<TableName extends TableNames> = GenericId<
  TableName,
  "_id"
>;