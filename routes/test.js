var express = require("express");
var router = express.Router();
const util = require('util');
const db = require("../database/database");

// Promisify the db.query method
const query = util.promisify(db.query).bind(db);

router.get('/test', async (req, res) => {
    try {
        const saletodaysql = "SELECT SUM(od.Quantity * p.price) as TotalSales FROM orders AS o JOIN orderdetail AS od ON o.OrderID = od.OrderID JOIN products AS p ON od.ProductID = p.id WHERE DATE(o.orderDate) = CURDATE()";
        const saletoday = await query(saletodaysql);
        const all = "SELECT p.name, SUM(od.Quantity) AS TotalQuantity FROM orderdetail AS od JOIN products AS p ON od.ProductID = p.id GROUP BY p.id, p.name ORDER BY TotalQuantity DESC LIMIT 1";

        const allsql = await query(all);

        res.send({saletoday , allsql})
    } catch (error) {
        return res.status(404).send(error.message);
    }
});

module.exports = router;