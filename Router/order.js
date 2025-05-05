const express = require('express');
const router = express.Router();
const { order } = require('../Controllers/orderConroller');

  

// router.post('/confirmOrder',order.confirmOrder)
router.post('/placeOrder',order.placeOrder)

router.get('/getOrders/:userId',order.getOrders)
router.put('/update-status/:orderId',order.updateOrderStatus)


router.put("/cancel/:orderId", order.CancelOrder);





module.exports = router;
