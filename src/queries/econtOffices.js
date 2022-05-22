/**
 * Fetch all econt offices
 * @param {Object} context - graphql context
 * @param {Object} input - Request input
 * @param {String} [query] - Regex match query string
 * @returns {Promise<*>} - econt offices
 */
export default async function econtOffices(context, input) {
  const { searchQuery } = input;

  const { collections: { EcontOffices } } = context;

  const query = {};

  if (searchQuery) {
    query.$or = [
      {
        code: { $regex: searchQuery, $options: "i" }
      },
      {
        name: { $regex: searchQuery, $options: "i" }
      },
      {
        nameEn: { $regex: searchQuery, $options: "i" }
      },
      {
        "address.address1": { $regex: searchQuery, $options: "i" }
      }
    ];
  }

  return EcontOffices.find(query);
}
