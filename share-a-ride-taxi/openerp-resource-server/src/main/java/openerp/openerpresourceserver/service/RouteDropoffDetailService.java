package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.RouteDropoffDetail;

import java.util.List;
import java.util.UUID;

public interface RouteDropoffDetailService {
    List<RouteDropoffDetail> getAllRouteDropoffDetails();
    RouteDropoffDetail getRouteDropoffDetailById(UUID id);
    RouteDropoffDetail createRouteDropoffDetail(RouteDropoffDetail routeDropoffDetail);
    RouteDropoffDetail updateRouteDropoffDetail(UUID id, RouteDropoffDetail routeDropoffDetail);
    void deleteRouteDropoffDetail(UUID id);
}
