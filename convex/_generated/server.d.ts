/* eslint-disable */
/**
 * Generated utilities for implementing server-side Convex query and mutation functions.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import {
  ActionBuilder,
  HttpActionBuilder,
  MutationBuilder,
  QueryBuilder,
  GenericActionCtx,
  GenericMutationCtx,
  GenericQueryCtx,
  GenericDatabaseReader,
  GenericDatabaseWriter,
} from "convex/server";
import type { DataModel } from "./dataModel.js";

/**
 * Define a query in this Convex app's public API.
 *
 * This function will be allowed to read your Convex database and will be accessible from the client.
 *
 * Usage:
 * ```js
 * export const myQuery = query(({ db }) => {
 *   return db.query("myTable").collect();
 * });
 * ```
 */
export declare const query: QueryBuilder<DataModel, "public">;

/**
 * Define a query that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to read from your Convex database. It will not be accessible from the client.
 *
 * Usage:
 * ```js
 * export const myQuery = internalQuery(({ db }) => {
 *   return db.query("myTable").collect();
 * });
 * ```
 */
export declare const internalQuery: QueryBuilder<DataModel, "internal">;

/**
 * Define a mutation in this Convex app's public API.
 *
 * This function will be allowed to modify your Convex database and will be accessible from the client.
 *
 * Usage:
 * ```js
 * export const myMutation = mutation(({ db }, args) => {
 *   db.insert("myTable", { ...args });
 * });
 * ```
 */
export declare const mutation: MutationBuilder<DataModel, "public">;

/**
 * Define a mutation that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to modify your Convex database. It will not be accessible from the client.
 *
 * Usage:
 * ```js
 * export const myMutation = internalMutation(({ db }, args) => {
 *   db.insert("myTable", { ...args });
 * });
 * ```
 */
export declare const internalMutation: MutationBuilder<DataModel, "internal">;

/**
 * Define an action in this Convex app's public API.
 *
 * This function will be allowed to run arbitrary code and will be accessible from the client.
 *
 * Usage:
 * ```js
 * export const myAction = action(async ({}) => {
 *   return "Hello World";
 * });
 * ```
 */
export declare const action: ActionBuilder<DataModel, "public">;

/**
 * Define an action that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to run arbitrary code. It will not be accessible from the client.
 *
 * Usage:
* ```js
 * export const myAction = internalAction(async ({}) => {
 *   return "Hello World";
 * });
 * ```
 */
export declare const internalAction: ActionBuilder<DataModel, "internal">;

/**
 * Define an HTTP action in this Convex app's public API.
 *
 * This function will be allowed to handle HTTP requests and will be accessible from the client.
 *
 * Usage:
 * ```js
 * export const myHttpAction = httpAction(async ({ request }) => {
 *   return { body: "Hello World", status: 200 };
 * });
 * ```
 */
export declare const httpAction: HttpActionBuilder<DataModel, "public">;

/**
 * Define an HTTP action that is only accessible from other Convex functions (but not from the client).
 *
 * This function will be allowed to handle HTTP requests. It will not be accessible from the client.
 *
 * Usage:
 * ```js
 * export const myHttpAction = internalHttpAction(async ({ request }) => {
 *   return { body: "Hello World", status: 200 };
 * });
 * ```
 */
export declare const internalHttpAction: HttpActionBuilder<DataModel, "internal">;

/**
 * Context for queries and mutations in the public API.
 */
export type MutationCtx = GenericMutationCtx<DataModel, "public">;
export type QueryCtx = GenericQueryCtx<DataModel, "public">;

/**
 * Context for queries and mutations in the internal API.
 */
export type InternalMutationCtx = GenericMutationCtx<DataModel, "internal">;
export type InternalQueryCtx = GenericQueryCtx<DataModel, "internal">;

/**
 * Context for actions in the public API.
 */
export type ActionCtx = GenericActionCtx<DataModel, "public">;

/**
 * Context for actions in the internal API.
 */
export type InternalActionCtx = GenericActionCtx<DataModel, "internal">;

/**
 * Database reader for the public API.
 */
export type Db = GenericDatabaseReader<DataModel, "public">;

/**
 * Database writer for the public API.
 */
export type DbMutation = GenericDatabaseWriter<DataModel, "public">;

/**
 * Database reader for the internal API.
 */
export type InternalDb = GenericDatabaseReader<DataModel, "internal">;

/**
 * Database writer for the internal API.
 */
export type InternalDbMutation = GenericDatabaseWriter<DataModel, "internal">;