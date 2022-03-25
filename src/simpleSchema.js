import SimpleSchema from "simpl-schema";

const withoutCodeCountries = ["AO", "AG", "AW", "BS", "BZ", "BJ", "BW",
  "BF", "BI", "CM", "CF", "KM", "CG", "CD", "CK", "CI", "DJ",
  "DM", "GQ", "ER", "FJ", "TF", "GM", "GH", "GD", "GN", "GY",
  "HK", "IE", "JM", "KE", "KI", "MO", "MW", "ML", "MR", "MU",
  "MS", "NR", "AN", "NU", "KP", "PA", "QA", "RW", "KN", "LC",
  "ST", "SA", "SC", "SL", "SB", "SO", "SR", "SY", "TZ", "TL",
  "TK", "TO", "TT", "TV", "UG", "AE", "VU", "YE", "ZW"];

/**
 * @name Metafield
 * @memberof Schemas
 * @type {SimpleSchema}
 * @property {String} key optional
 * @property {String} namespace optional
 * @property {String} scope optional
 * @property {String} value optional
 * @property {String} valueType optional
 * @property {String} description optional
 */
const Metafield = new SimpleSchema({
  key: {
    type: String,
    max: 30,
    optional: true
  },
  namespace: {
    type: String,
    max: 20,
    optional: true
  },
  scope: {
    type: String,
    optional: true
  },
  value: {
    type: String,
    optional: true
  },
  valueType: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  }
});


/**
 * @name EcontOfficeAddressSchema
 * @memberof Schemas
 * @type {SimpleSchema}
 * @property {String} _id
 * @property {String} fullName required
 * @property {String} firstName
 * @property {String} lastName
 * @property {String} address1 required
 * @property {String} address2
 * @property {String} city required
 * @property {String} company
 * @property {String} phone required
 * @property {String} region required, State/Province/Region
 * @property {String} postal required
 * @property {String} country required
 * @property {Boolean} isCommercial required
 * @property {Boolean} isBillingDefault required
 * @property {Boolean} isShippingDefault required
 * @property {Boolean} failedValidation
 * @property {Metafield[]} metafields
 */
export const EcontOfficeAddressSchema = new SimpleSchema({
  "_id": {
    type: String,
    optional: true
  },
  "address1": {
    label: "Address 1",
    type: String
  },
  "address2": {
    label: "Address 2",
    type: String,
    optional: true
  },
  "city": {
    type: String,
    label: "City"
  },
  "company": {
    type: String,
    label: "Company",
    optional: true
  },
  "region": {
    label: "State/Province/Region",
    type: String
  },
  "postal": {
    label: "ZIP/Postal Code",
    type: String,
    optional: true,
    custom() {
      const country = this.field("country");
      if (country && country.value) {
        if (!withoutCodeCountries.includes(country.value) && !this.value) {
          return "required";
        }
      }
      return true;
    }
  },
  "country": {
    type: String,
    label: "Country"
  },
  "isCommercial": {
    label: "This is a commercial address.",
    type: Boolean,
    defaultValue: false
  },
  "isBillingDefault": {
    label: "Make this your default billing address?",
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  "isShippingDefault": {
    label: "Make this your default shipping address?",
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  "failedValidation": {
    label: "Failed validation",
    type: Boolean,
    defaultValue: false,
    optional: true
  },
  "metafields": {
    type: Array,
    optional: true
  },
  "metafields.$": {
    type: Metafield
  }
});

export const EcontOfficeSchema = new SimpleSchema({
  "id": Number,
  // A code identifying the office
  "code": String,
  // True if the office is a mobile post station
  // The bulgarian name of the office
  "name": String,
  // The number international name of the office
  "nameEn": String,
  // A list of phone numbers for the office
  "phones": {
    type: Array
  },
  "phones.$": {
    type: String
  },
  // The address where the office is located
  "address": EcontOfficeAddressSchema,
  // The currency the office works with
  "currency": String,
  // Types of shipments which can be sent/collected to/from the office
  "shipmentTypes": Array,
  "shipmentTypes.$": {
    type: String
  }
});
