package openerp.openerpresourceserver.controller;

import jakarta.validation.Valid;
import openerp.openerpresourceserver.model.dto.request.FilterScheduleDto;
import openerp.openerpresourceserver.model.entity.*;
import openerp.openerpresourceserver.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/semesters")
    public ResponseEntity<List<Semester>> getAllSemester() {
        try {
            List<Semester> semesterList = scheduleService.getSemester();
            if (semesterList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(semesterList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/institutes")
    public ResponseEntity<List<Institute>> getAllInstitute() {
        try {
            List<Institute> instituteList = scheduleService.getInstitute();
            if (instituteList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(instituteList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/class-code")
    public ResponseEntity<List<ClassCode>> getAllClassCode() {
        try {
            List<ClassCode> classCodeList = scheduleService.getClassCode();
            if (classCodeList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(classCodeList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/update/class-code")
    public ResponseEntity<Void> updateClassCode() {
        try {
            scheduleService.updateClassCode();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/classroom")
    public ResponseEntity<List<Classroom>> getAllClassroom() {
        try {
            List<Classroom> classroomList = scheduleService.getClassroom();
            if (classroomList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(classroomList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/weekday")
    public ResponseEntity<List<WeekDay>> getAllWeekDay() {
        try {
            List<WeekDay> weekDayList = scheduleService.getWeekDay();
            if (weekDayList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(weekDayList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/update/weekday")
    public ResponseEntity<Void> updateWeekDay() {
        try {
            scheduleService.updateWeekDay();
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/get-by-condition")
    public ResponseEntity<List<Schedule>> getScheduleByCondition(@Valid @RequestBody FilterScheduleDto requestDto) {
        try {
            List<Schedule> result = scheduleService.searchSchedule(requestDto);
            if (result.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/calculate-time")
    public ResponseEntity<String> calculateTimePerformance(@Valid @RequestBody FilterScheduleDto requestDto) {
        try {
            String result = scheduleService.calculateTimePerformance(requestDto);
            if (result.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
