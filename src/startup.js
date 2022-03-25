import importEcontOfficesJob from "./jobs/importEcontOfficesJob.js";
import updateEcontOffices from "./utils/updateEcontOffices.js";

/**
 * @summary Called on startup
 * @param {Object} context Startup context
 * @param {Object} context.app The ReactionAPI instance
 * @param {Object} context.collections A map of MongoDB collections
 * @returns {undefined}
 */
export default async function econtOfficesStartup(context) {
  await updateEcontOffices(context);
  await importEcontOfficesJob(context);
}
