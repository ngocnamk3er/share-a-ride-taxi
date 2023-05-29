package openerp.containertransport.service;

import openerp.containertransport.dto.OrderFilterRequestDTO;
import openerp.containertransport.dto.OrderModel;
import openerp.containertransport.dto.OrdersRes;
import openerp.containertransport.entity.Order;

import java.util.List;

public interface OrderService {
    OrderModel createOrder(OrderModel orderModel);
    OrdersRes filterOrders(OrderFilterRequestDTO orderFilterRequestDTO);
    OrderModel updateOrder(OrderModel orderModel);
}
