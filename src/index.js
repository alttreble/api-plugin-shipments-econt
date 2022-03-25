import pkg from "../package.json";
import getFulfillmentMethodsWithQuotes from "./getFulfillmentMethodsWithQuotes.js";
import econtOfficesStartup from "./startup.js";
import queries from "./queries/index.js";
import schemas from "./schemas/index.js";
import resolvers from "./resolvers/index.js";

/**
 * @summary Import and call this function to add this plugin to your API.
 * @param {ReactionAPI} app The ReactionAPI instance
 * @returns {undefined}
 */
export default async function register(app) {
  await app.registerPlugin({
    label: "Econt Shipments",
    name: "shipments-econt",
    version: pkg.version,
    collections: {
      EcontOffices: {
        name: "EcontOffices"
      }
    },
    queries,
    graphQL: {
      resolvers,
      schemas
    },
    functionsByType: {
      startup: [econtOfficesStartup],
      getFulfillmentMethodsWithQuotes: [getFulfillmentMethodsWithQuotes]
    },
    shopSettingsConfig: {
      isEcontFulfillmentEnabled: {
        defaultValue: true,
        permissionsThatCanEdit: ["reaction:legacy:shippingMethods/update:settings"],
        simpleSchema: {
          type: Boolean
        }
      }
    }
  });
}
