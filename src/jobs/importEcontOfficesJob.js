import Logger from "@reactioncommerce/logger";
import updateEcontOffices from "../utils/updateEcontOffices.js";
import updateImportTaskForEcontOffices from "./updateImportTaskForEcontOffices.js";

const jobType = "econtOffices/import";

/**
 * @name importEcontOfficesJob
 * @summary Initializes and processes a job that updates local list of econt offices
 * @param {Object} context App context
 * @returns {undefined}
 */
export default async function importEcontOfficesJob(context) {
  await context.backgroundJobs.addWorker({
    type: jobType,
    workTimeout: 180 * 1000,
    async worker(job) {
      Logger.info(`${jobType} job started`);
      try {
        await updateEcontOffices(context);
        job.done(`${jobType} job done`, { repeatId: true });
      } catch (error) {
        job.fail(`Failed to import econt offices. Error: ${error}`);
      }
    }
  });

  return updateImportTaskForEcontOffices(context);
}
