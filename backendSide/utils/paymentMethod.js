// const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
// const axios=require("axios");
// const logger = require('../startup/logging');

// function environment() {
//     try{
//       let clientId = process.env.PAYPAL_CLIENT_ID;
//       let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
//       return new checkoutNodeJssdk.SandboxEnvironment(clientId, clientSecret);
//     }catch(ex){
//       logger.error(ex);
//     }
// }

// function client() {
//   try{
//     return new checkoutNodeJssdk.PayPalHttpClient(environment());
//   }catch(ex){
//       logger.error(ex);
//   }
// }


// async function generateAccessToken() {
//   try{
//   const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
//   const response = await axios.post(
//     'https://api-m.sandbox.paypal.com/v1/oauth2/token',
//     'grant_type=client_credentials',
//     {
//       headers: {
//         Authorization: `Basic ${auth}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     }
//   );
//   return response.data.access_token;
//    }catch(ex){
//       logger.error(ex);
//   }
// }

// module.exports = { client,generateAccessToken };

// const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const axios = require('axios');

// const { SandboxEnvironment, PayPalHttpClient } = checkoutNodeJssdk.core;

// // تهيئة بيئة PayPal (Sandbox أو Production)
// function environment() {
//     try {
//         let clientId = process.env.PAYPAL_CLIENT_ID;
//         let clientSecret = process.env.PAYPAL_CLIENT_SECRET;
//         // تحقق من وجود المتغيرات
//         if (!clientId || !clientSecret) {
//             logger.error("PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET are not set in environment variables.");
//             throw new Error("PayPal credentials missing.");
//         }
//         return new SandboxEnvironment(clientId, clientSecret);
//     } catch (ex) {
//         logger.error(`Error in PayPal environment setup: ${ex.message}`);
//         throw ex; // أعد رمي الخطأ ليتم التعامل معه في مكان الاستدعاء
//     }
// }

// // إنشاء PayPal HTTP Client (يجب أن يكون كائنًا واحدًا فقط في التطبيق)
// // الأفضل أن يتم إنشاء هذا الكائن مرة واحدة وتصديره مباشرة
// const payPalClient = new PayPalHttpClient(environment()); // <--- التغيير هنا

async function generateAccessToken() {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(`${baseURL}/v1/oauth2/token`, "grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data.access_token;
}

module.exports = {
    // client: payPalClient,
    generateAccessToken,
    // OrdersCreateRequest: checkoutNodeJssdk.orders.OrdersCreateRequest,
    // OrdersCaptureRequest: checkoutNodeJssdk.orders.OrdersCaptureRequest,
};