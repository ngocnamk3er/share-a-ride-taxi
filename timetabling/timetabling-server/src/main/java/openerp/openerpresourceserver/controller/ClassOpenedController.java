package openerp.openerpresourceserver.controller;

import jakarta.validation.Valid;
import openerp.openerpresourceserver.model.dto.request.UpdateClassOpenedDto;
import openerp.openerpresourceserver.model.entity.ClassOpened;
import openerp.openerpresourceserver.model.entity.Classroom;
import openerp.openerpresourceserver.service.ClassOpenedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/class-opened")
public class ClassOpenedController {

    @Autowired
    private ClassOpenedService service;

    @GetMapping("/get-all")
    public ResponseEntity<List<ClassOpened>> getAll(@RequestParam(required = false) String semester) {
        try {
            List<ClassOpened> classOpenedList;
            if (semester != null) {
                classOpenedList = service.getBySemester(semester);
            } else classOpenedList = service.getAll();
            if (classOpenedList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(classOpenedList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update")
    public ResponseEntity<List<ClassOpened>> update(@Valid @RequestBody UpdateClassOpenedDto requestDto) {
        try {
            List<ClassOpened> classOpenedList = service.updateClassOpenedList(requestDto);
            if (classOpenedList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(classOpenedList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
