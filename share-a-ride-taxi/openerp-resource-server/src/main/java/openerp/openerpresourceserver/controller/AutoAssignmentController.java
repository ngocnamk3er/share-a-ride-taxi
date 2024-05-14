package openerp.openerpresourceserver.controller;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/auto-assign")
@PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
public class AutoAssignmentController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello!";
    }
}
