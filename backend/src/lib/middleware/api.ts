import middy from "@middy/core";
import { Handler } from "aws-lambda";
import httpErrorHandler from "@middy/http-error-handler";
import { defaultMiddleware } from ".";
import { LambdaApiHandler } from "../types";
import { IQueueProvider } from "../../dependencies/queues/queue.interface";
import { RealClock } from "../../dependencies/clock-real";

import { logger } from "../../dependencies/logger";
import SQSQueue from "../../dependencies/queues/sqs-queue";
import { IDatabase } from "../../dependencies/database.interface";
import { SQLiteDatabaseConnection } from "../../dependencies/sqlite.database";

/**
 * This is out own custom middleware, here we instantiate the injecatble dependencies such as database,
 * azue devops clients, system clock. We also handle db connection before calling the handler
 * and close the connection after or onError.
 */
const customMiddleware: middy.MiddlewareObj = {
  before: async (request) => {
    // More information on `Context`: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
    const { context } = request;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { db, queue, devOpsClient, systemClock } = context as any;

    if (!systemClock) {
      const clock = new RealClock();
      Object.assign(context, { systemClock: clock });
    }

    if (!db) {

      try {
        //const database: PostgresDatabaseConnection = new PostgresDatabaseConnection();
        const database: IDatabase = await SQLiteDatabaseConnection.getInstance();
        Object.assign(context, { db: database });
      } catch (e) {
        logger.error("Failed to connect to the database", e);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Internal Server Error" }),
        };
      }
    }

    if (!queue) {
      try {
        const queue: IQueueProvider = new SQSQueue();
        Object.assign(context, { queue: queue });
      } catch (e) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Internal Server Error" }),
        };
      }
    }
  },
  after: (request) => {
    const { context } = request;
    //const { db } = context as any;
    //db.close();
  },
  onError: (request) => {
    const { context } = request;
    //const { db } = context as any;
    //db?.close();
  },
};


export function apiGateway(handler: LambdaApiHandler, _options = {}): Handler {
  const callback = middy(handler);
  callback.use(defaultMiddleware);
  callback.use(customMiddleware);
  callback.use(httpErrorHandler());
  return callback;
}
