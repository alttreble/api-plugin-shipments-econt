import getEcontClient from "./getEcontClient.js";

/**
 * @name updateEcontOffices
 * @summary Update local list of econt offices
 * @param {Object} context App context
 * @returns {Promise<any>} - promise for resolving all econt offices
 */
export default async function updateEcontOffices(context) {
  const { collections: { EcontOffices } } = context;

  const econtClient = getEcontClient();

  const data = await econtClient.NomenclaturesService.getOffices({
    countryCode: "BGR"
  });

  const promises = data.offices.map(async (office) => EcontOffices.updateOne({
    _id: office.id
  }, {
    $set: {
      _id: office.id,
      // A code identifying the office
      code: office.code,
      // True if the office is a mobile post station
      // The bulgarian name of the office
      name: office.name,
      // The number international name of the office
      nameEn: office.nameEn,
      // A list of phone numbers for the office
      phones: office.phones,
      // The address where the office is located
      address: {
        address1:
          office.address.street ||
          office.address.other ||
          "No street",
        city: office.address.city.name || "Econt City",
        region:
          office.address.city.regionName ||
          office.address.city.name ||
          "Econt region",
        postal:
          office.address.city.postCode ||
          "Econt postal",
        country:
          office.address.city.country.code2 || "BG",
        metafields: [
          {
            key: "courier",
            value: "econt"
          },
          {
            key: "courierOfficeCode",
            value: office.code
          }
        ],
        isCommercial: false
      },
      // The currency the office works with
      currency: office.currency,
      // Types of shipments which can be sent/collected to/from the office
      shipmentTypes: office.shipmentTypes
    }
  }, {
    upsert: true
  }));

  return Promise.all(promises);
}
