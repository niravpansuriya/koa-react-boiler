
const axios = require("axios");

//----------------------------------------------------------------------------------

/**
 * This function get shop data from shopify
 * @param {String} shop shop uri
 * @param {String} accessToken access token
 * @return {promise}
 */
const getShopData = (shop, accessToken) => {
	return new Promise(async (resolve, reject) => {
		try {
			// shopify api for get shop data
			const accessShopUrl = `https://${shop}/admin/shop.json`;

			// set header
			const request_headers = {
				"X-Shopify-Access-Token": accessToken,
			};

			const shopResp = await axios({
				url: accessShopUrl,
				method: "GET",
				responseType: "json",
				headers: request_headers,
			});

			resolve(shopResp.data);
		} catch (error) {
			reject(error);
		}
	});
};

//----------------------------------------------------------------------------------

module.exports = {getShopData}