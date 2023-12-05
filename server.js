const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SSLCommerzPayment = require('sslcommerz-lts');

const generateTransactionId = require('./src/app/sslcommerce/helpers/generateTransid');
const { SSLCOMMERZ_STORE_ID, SSLCOMMERZ_STORE_SECRCT_KEY, IS_LIVE  } = require("./src/app/sslcommerce/utils/sslcommerz.env");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// welcome
app.get("/", (req, res) => res.send("Hello World!"));

const tran_id = generateTransactionId(); 
const sslcz = new SSLCommerzPayment(SSLCOMMERZ_STORE_ID, SSLCOMMERZ_STORE_SECRCT_KEY, IS_LIVE)


//inlitiatePayment
app.post("/order", async (req, res) => {
    let products = req.body;
    console.log(products)
    const data = {
        total_amount: products.price,
        currency: products.currency,
        tran_id: tran_id,
        success_url: `http://localhost:3000/payment/success/${tran_id}`,
        fail_url: `http://localhost:3000/payment/failed/${tran_id}`,
        cancel_url: `http://localhost:3000/payment/cancel/${tran_id}`,
        ipn_url: 'http://localhost:3000/ipn',
        shipping_method: 'Courier',
        product_name: products.name,
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: products.address,
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    console.log(data);
    try {
        const apiResponse = await sslcz.init(data)
        res.status(201).json({ success: true, status: 201, apiResponse: apiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.post("/payment/success/:tran_id", async (req, res) => {
    console.log(req.body)
    res.status(200).json({data: req.body})
})

app.post("/payment/failed/:tran_id", async (req, res) => {
    return res.status(400).json({data: req.body})
})

app.post("/payment/cancel/:tran_id", async (req, res) => {
    return res.status(200).json({data: req.body})
})


//validate
app.get('/validate', (req, res) => {
    console.log(req)
    const val_id = req.query;
    const data = {
        val_id: val_id.val_id,
    };
    sslcz.validate(data)
        .then(response => {
            console.log(response);
            res.status(200).json(response);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});


//Initiate refund
app.get('/initiate-refund', async (req, res) => {
    console.log(req);
    const refund = req.query;
    const data = {
        refund_amount: refund.refund_amount,
        refund_remarks: refund.refund_remarks,
        bank_tran_id:refund.bank_tran_id,
        refe_id:refund.refe_id,
    }
    try {
        const apiResponse = await sslcz.initiateRefund(data)
        console.log(apiResponse)
        res.status(201).json({ success: true, status: 201, apiResponse: apiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


//Initiate refund
app.get('/refund-query', async (req, res) => {
    console.log(req);
    const refund = req.query;
    const data = {
        refund_ref_id:refund.refund_ref_id
    }
    try {
        const apiResponse = await sslcz.refundQuery(data)
        console.log(apiResponse)
        res.status(201).json({ success: true, status: 201, apiResponse: apiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

//Transaction query by transaction id
app.get('/transaction-query-by-transaction-id', async (req, res) => {
    const transaction = req.query;
    console.log(transaction)
    const data = {
        tran_id: transaction.tran_id,
    };
    try {
        const apiResponse = await sslcz.transactionQueryByTransactionId(data)
        console.log(apiResponse)
        res.status(201).json({ success: true, status: 201, apiResponse: apiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


//Transaction query by session id
app.get('/transaction-query-by-session-id', async (req, res) => {
    const session_key_id = req.query;
    console.log(session_key_id)
    const data = {
        sessionkey:session_key_id.session_key_id,
    };
    try {
        const apiResponse = await sslcz.transactionQueryBySessionId(data)
        console.log(apiResponse)
        res.status(201).json({ success: true, status: 201, apiResponse: apiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

const port = 3000;
app.listen(port, () => console.log(`listening on  http://localhost:${port}`));
  