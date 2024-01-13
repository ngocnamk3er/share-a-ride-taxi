package openerp.openerpresourceserver.controller;

import jakarta.validation.Valid;
import openerp.openerpresourceserver.exception.ConflictScheduleException;
import openerp.openerpresourceserver.exception.UnableSeparateClassException;
import openerp.openerpresourceserver.exception.UnableStartPeriodException;
import openerp.openerpresourceserver.model.dto.request.AutoMakeScheduleDto;
import openerp.openerpresourceserver.model.dto.request.FilterClassOpenedDto;
import openerp.openerpresourceserver.model.dto.request.MakeScheduleDto;
import openerp.openerpresourceserver.model.dto.request.UpdateClassOpenedDto;
import openerp.openerpresourceserver.model.entity.ClassOpened;
import openerp.openerpresourceserver.model.entity.Schedule;
import openerp.openerpresourceserver.service.ClassOpenedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @DeleteMapping("/delete-ids")
    public ResponseEntity<Void> deleteByIds(@RequestParam List<Long> ids) {
        try {
            service.deleteByIds(ids);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/search")
    public ResponseEntity<List<Schedule>> getClassOpenedByCondition(@Valid @RequestBody FilterClassOpenedDto requestDto) {
        try {
            List<Schedule> result = service.searchClassOpened(requestDto);
            if (result.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/separate-class")
    public ResponseEntity<String> separateClass(@RequestBody MakeScheduleDto requestDto) {
        try {
            service.setSeparateClass(requestDto.getId(), requestDto.getIsSeparateClass());
            return new ResponseEntity<>(null, HttpStatus.OK);
        } catch (UnableSeparateClassException e) {
            return new ResponseEntity<>(e.getCustomMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/make-schedule")
    public ResponseEntity<String> makeSchedule(@Valid @RequestBody MakeScheduleDto requestDto) {
        try {
            service.makeSchedule(requestDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (UnableStartPeriodException e) {
            return new ResponseEntity<>(e.getCustomMessage(), HttpStatus.BAD_REQUEST);
        } catch (ConflictScheduleException e) {
            return new ResponseEntity<>(e.getCustomMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/auto-make-schedule")
    public ResponseEntity<String> autoMakeSchedule(@Valid @RequestBody AutoMakeScheduleDto autoMakeScheduleDto) {
        try {
            service.automationMakeScheduleForCTTT(autoMakeScheduleDto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
