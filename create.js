const { publishSupplyWarningNotification } = require("./DomainNotifications");
const axios = require("axios");
require('@sap/xsenv').loadEnv();

const categories = {
    2: "Condiments",
    4: "Dairy Products",
    6: "Meat/Poultry"
};

(async () => {
    try {
        const res = await axios("https://services.odata.org/V2/Northwind/Northwind.svc/Products?$format=json");

        const criticalSupplyOfCategory6 = res.data.d.results.filter(a => a.UnitsInStock <= a.ReorderLevel && a.CategoryID === 6);

        await Promise.all(criticalSupplyOfCategory6.map(product => publishSupplyWarningNotification({
            product: product.ProductName,
            category: categories[product.CategoryID],
            stock: `${product.UnitsInStock}`,
            recipients: ["vshl.kwatra@gmail.com"]
        })));

        console.log("Success");
    } catch (e) {
        if (e.response) {
            console.error(`${e.response.statusText} (${e.response.status}): ${JSON.stringify(e.response.data.error.message)}.`)
        } else {
            console.error(e)
        }
    }
})()