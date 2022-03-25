import Logger from "@reactioncommerce/logger";

const jobType = "econtOffices/import";

/**
 * @summary Schedules a job to update sitemaps for one shop, canceling any existing job of this type.
 * @param {Object} context App context
 * @return {Promise<undefined>} Nothing
 */
export default async function updateImportTaskForEcontOffices(context) {
  Logger.debug(`Adding ${jobType} job.`);

  // First cancel existing job for this shop. We can't use `cancelRepeats` option
  // on `scheduleJob` because that cancels all of that type, whereas we want to
  // cancel only those with the same type AND the same shopId.
  await context.backgroundJobs.cancelJobs({
    type: jobType,
    data: { }
  });

  await context.backgroundJobs.scheduleJob({
    type: jobType,
    data: {},
    retry: {
      retries: 5,
      wait: 60000,
      backoff: "exponential"
    },
    schedule: "every 24 hours"
  });
}
