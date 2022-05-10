import Logger from "@reactioncommerce/logger";
import { ShipmentType } from "econt-js";
import getEcontClient from "./utils/getEcontClient.js";

const packageName = "econt-shipping";

// Office Tolstoy Sofia
const senderOfficeCode = "1131";

/**
 * Get the courier code of a shipping address if exist
 * @param {Object} shippingAddress order destination shipping address
 * @returns {string | null} courier office code if found
 */
function getCourierOfficeCode(shippingAddress) {
  const courierMetafield = shippingAddress?.metafields
    .find((metafield) => metafield.key === "courier");

  if (!courierMetafield) return null;

  if (courierMetafield.value !== "econt") return null;

  const courierOfficeCodeMetafield = shippingAddress.metafields
    .find((metafield) => metafield.key === "courierOfficeCode");

  return courierOfficeCodeMetafield.value;
}

/**
 * Calculate the total weight of all items in an order
 * @param {Object} items order items
 * @returns {string | null} total weight in kgs
 */
function getItemsTotalWeight(items) {
  return items.reduce((totalWeight, item) =>
    totalWeight + ((item.parcel?.weight || 0) * item.quantity), 0);
}

/**
 * @summary Returns a list of fulfillment method quotes based on the items in a fulfillment group.
 * @param {Object} context - Context
 * @param {Object} commonOrder - details about the purchase a user wants to make.
 * @param {Array} [previousQueryResults] - an array of shipping rates and
 * info about failed calls to the APIs of some shipping methods providers
 * e.g Shippo.
 * @returns {Array} - an array that contains two arrays: the first array will
 * be an updated list of shipping rates, and the second will contain info for
 * retrying this specific package if any errors occurred while retrieving the
 * shipping rates.
 * @private
 */
export default async function getFulfillmentMethodsWithQuotes(context, commonOrder, previousQueryResults = []) {
  const [rates = [], retrialTargets = []] = previousQueryResults;
  const currentMethodInfo = { packageName };

  if (retrialTargets.length > 0) {
    const isNotAmongFailedRequests = retrialTargets.every((target) => target.packageName !== packageName);
    if (isNotAmongFailedRequests) {
      return previousQueryResults;
    }
  }

  const initialNumOfRates = rates.length;

  const { isEcontFulfillmentEnabled } = await context.queries.appSettings(context, commonOrder.shopId);

  if (!isEcontFulfillmentEnabled) {
    return [rates, retrialTargets];
  }

  const { shippingAddress, items } = commonOrder;

  const receiverOfficeCode = getCourierOfficeCode(shippingAddress);
  if (!receiverOfficeCode) {
    return [rates, retrialTargets];
  }

  const econtClient = getEcontClient();

  const createLabelData = await econtClient.LabelService.createLabel({
    mode: "calculate",
    label: {
      senderOfficeCode,
      receiverOfficeCode,
      weight: getItemsTotalWeight(items),
      packCount: items.reduce((total, item) => total + item.quantity, 0),
      shipmentType: ShipmentType.pack
    }
  });

  if (createLabelData) {
    rates.push({
      carrier: "Econt Express",
      handlingPrice: 0,
      method: {
        _id: "econt-shipping",
        carrier: "Econt Express",
        cost: createLabelData.label.totalPrice,
        rate: createLabelData.label.totalPrice,
        handling: 0,
        name: "Еконт от офис до офис",
        label: "Еконт от офис до офис",
        fulfillmentTypes: ["shipping"],
        enabled: true
      },
      rate: createLabelData.label.totalPrice,
      shippingPrice: createLabelData.label.totalPrice,
      shopId: commonOrder.shopId
    });
  }

  if (rates.length === initialNumOfRates) {
    const errorDetails = {
      requestStatus: "error",
      shippingProvider: packageName,
      message: "Econt shipping did not return any shipping methods."
    };
    rates.push(errorDetails);
    retrialTargets.push(currentMethodInfo);
    return [rates, retrialTargets];
  }

  Logger.debug("Econt getFulfillmentMethodsWithQuotes", rates);
  return [rates, retrialTargets];
}

