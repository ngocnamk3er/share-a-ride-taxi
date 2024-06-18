package openerp.openerpresourceserver.controller;

import openerp.openerpresourceserver.exception.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/demo")
@ResponseStatus(HttpStatus.ACCEPTED)
public class DemoController {

    @GetMapping("/exception")
    public String triggerException() {
        return "12345678";
//        throw new CustomException("This is a custom exception message");
    }
}
