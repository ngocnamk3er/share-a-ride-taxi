package com.hust.wmsbackend.management.repository;

import com.hust.wmsbackend.management.entity.AssignedOrderItem;
import com.hust.wmsbackend.management.entity.enumentity.AssignedOrderItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssignedOrderItemRepository extends JpaRepository<AssignedOrderItem, UUID> {

    List<AssignedOrderItem> findAllByOrderId(UUID orderId);

    List<AssignedOrderItem> findAllByStatus(AssignedOrderItemStatus status);

}
