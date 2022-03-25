/**
 * Fetch all econt offices
 * @param {Object} parentResult - unused
 * @param {ConnectionArgs} args - unused
 * @param {Object} context - graphql execution context
 * @returns {Promise<Object>} - econt offices
 */
export default async function econtOffices(parentResult, args, context) {
  return context.queries.econtOffices(context);
}
