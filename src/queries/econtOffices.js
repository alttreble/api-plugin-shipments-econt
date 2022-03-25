/**
 * Fetch all econt offices
 * @param {Object} context - graphql context
 * @returns {Promise<*>} - econt offices
 */
export default async function econtOffices(context) {
  const { collections: { EcontOffices } } = context;
  return EcontOffices.find({}).toArray();
}
