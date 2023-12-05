const queryPayment = async(request)=> {
    try {
        if (!baseUrl) {
            throw new Error("Base url not found");
        }

        if (!config.urls.query_transaction) {
            throw new Error("Order validate URL Not found");
        }

        const url = baseUrl + config.urls.query_transaction;
        const response = await axios.post(url, {
            sessionkey: request.getTransactionQueryId(),
            store_id: getConfigByKey("store_id"),
            store_passwd: getConfigByKey("store_password"),
        });

        const statusCode = response.status;
        const responseData = response.data;

        if (statusCode !== 200) {
            throw new Error(responseData.errorMessage, responseData.errorCode);
        }

        const paymentResponse = {
            status: responseData.status,
            paymentTime: responseData.tran_date,
            transactionId: responseData.tran_id,
            amount: responseData.amount,
            currency: responseData.currency,
            // Add other properties as needed
        };

        const data = {
            api_connect: responseData.APIConnect,
            session_key: responseData.sessionkey,
            val_id: responseData.val_id,
            store_amount: responseData.store_amount,
            card_type: responseData.card_type,
            card_no: responseData.card_no,
            bank_tran_id: responseData.bank_tran_id,
            card_issuer: responseData.card_issuer,
            card_brand: responseData.card_brand,
            card_issuer_country: responseData.card_issuer_country,
            card_issuer_country_code: responseData.card_issuer_country_code,
            currency_type: responseData.currency_type,
            currency_amount: responseData.currency_amount,
            value_a: responseData.value_a,
            value_b: responseData.value_b,
            risk_level: responseData.risk_level,
            risk_title: responseData.risk_title,
        };

        return paymentResponse;

    } catch (error) {
        throw new Error(error.message, error.code || 400);
    }
}