import Econt from "econt-js";
import config from "../config.js";

/**
 * Create econt client
 * @returns {Econt.Client} econt client
 */
export default function getEcontClient() {
  return new Econt.Client({
    username: config.API_ECONT_USERNAME,
    password: config.API_ECONT_PASSWORD,
    testMode: config.API_ECONT_TEST_MODE
  });
}
