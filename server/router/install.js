const { default: shopifyAuth } = require("@shopify/koa-shopify-auth");

//----------------------------------------------------------------------------------

const Shop = require("../model/Shop");
const shopControllers = require("../controllers/shop");

//----------------------------------------------------------------------------------

const { SHPIFY_API_SECRET, SHOPIFY_API_KEY } = process.env;

// ******* CHANGE ACCESS SCOPES HERE ***********************
const scopes = ["write_products"];

//----------------------------------------------------------------------------------

module.exports = shopifyAuth({
  apiKey: SHOPIFY_API_KEY,
  secret: SHPIFY_API_SECRET,
  scopes,
  accessMode: "offline",

  async afterAuth(ctx) {

    try {
      // get shop and access token from session
      const { shop, accessToken } = ctx.session;

      if (!shop || !accessToken) {
        ctx.status = 400;
        return (ctx.body = {
          status: 400,
          message: "shop or access token not found",
        });
      }

      // check if data is in the database or not
      const shopData = await Shop.findOne({ shop });

      if (shopData) {
        // if access token is changed
        if (accessToken !== shopData.accessToken) {
          // update in data database
          await Shop.updateOne(
            { shop },
            { $set: { accessToken, appstatus: "install" } }
          );
        }
      } else {
        // get shop data from shopify
        const shopifyShopData = await shopControllers.getShopData(
          shop,
          accessToken
        );

        // save shop data in shopify
        const shopifyData = {
          shop: shop,
          accessToken,
          phone: shopifyShopData.shop.phone,
          country_code: shopifyShopData.shop.country_code,
          country_name: shopifyShopData.shop.country_name,
          accessScope: scopes.join(),
          timestamp: new Date().getTime(),
          domain: shopifyShopData.shop.domain,
          email: shopifyShopData.shop.email,
          customer_email: shopifyShopData.shop.customer_email,
          money_format: shopifyShopData.shop.money_format,
          currency: shopifyShopData.shop.currency,
          timezone: shopifyShopData.shop.iana_timezone,
        };

        // ************ PUT OTHER THINGS HERE **********************

        const shopModel = new Shop(shopifyData);
        await shopModel.save();
      }

      // redirect to the frontend
      return ctx.redirect(`/?shop=${shop}`);
    } catch (error) {
      console.log("Error in after auth", error);
      ctx.status = 500;
      return (ctx.body = { status: 500, message: "internal server error" });
    }
  },
});
