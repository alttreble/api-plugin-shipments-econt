import getPaginatedResponse from "@reactioncommerce/api-utils/graphql/getPaginatedResponse.js";
import wasFieldRequested from "@reactioncommerce/api-utils/graphql/wasFieldRequested.js";

/**
 * Fetch all econt offices
 * @param {Object} parentResult - unused
 * @param {ConnectionArgs} args - unused
 * @param {Object} context - graphql execution context
 * @param {Object} info Info about the GraphQL request
 * @returns {Promise<Object>} - econt offices
 */
export default async function econtOffices(parentResult, args, context, info) {
  const {
    searchQuery,
    ...connectionArgs
  } = args;

  const query = await context.queries.econtOffices(context, { searchQuery });

  return getPaginatedResponse(query, connectionArgs, {
    includeHasNextPage: wasFieldRequested("pageInfo.hasNextPage", info),
    includeHasPreviousPage: wasFieldRequested("pageInfo.hasPreviousPage", info),
    includeTotalCount: wasFieldRequested("totalCount", info)
  });
}
