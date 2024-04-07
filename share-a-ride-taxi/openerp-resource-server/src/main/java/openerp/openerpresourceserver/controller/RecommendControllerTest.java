package openerp.openerpresourceserver.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/recommend")
public class RecommendControllerTest {
    @GetMapping()
    public String home() {
        return "this is recommend controller";
    }
}
