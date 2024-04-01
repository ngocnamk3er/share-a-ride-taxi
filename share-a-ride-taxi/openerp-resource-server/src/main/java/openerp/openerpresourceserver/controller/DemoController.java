package openerp.openerpresourceserver.controller;

import openerp.openerpresourceserver.enums.RequestType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

    @GetMapping("/hi")
    public String home() {
        return "Welcome to the demo application!";
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello, world!";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    public String admin() {
        System.out.println("------------");
        System.out.println(RequestType.passenger.toString());
        System.out.println(RequestType.passenger);
        System.out.println("------------");
        return "This is an admin endpoint";
    }

}