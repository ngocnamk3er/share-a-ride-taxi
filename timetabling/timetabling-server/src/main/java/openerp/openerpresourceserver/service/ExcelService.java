package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.model.entity.ClassOpened;
import openerp.openerpresourceserver.model.entity.Classroom;
import openerp.openerpresourceserver.model.entity.Schedule;
import openerp.openerpresourceserver.repo.ClassOpenedRepo;
import openerp.openerpresourceserver.repo.ClassroomRepo;
import openerp.openerpresourceserver.repo.ScheduleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import openerp.openerpresourceserver.helper.ExcelHelper;

@Service
public class ExcelService {

    @Autowired
    private ScheduleRepo scheduleRepo;

    @Autowired
    private ClassOpenedRepo classOpenedRepo;

    @Autowired
    private ClassroomRepo classroomRepo;

    public ByteArrayInputStream load() {
        List<Schedule> schedules = this.getAllSchedules();
        ByteArrayInputStream in = ExcelHelper.schedulesToExcel(schedules);
        return in;
    }

    public ByteArrayInputStream loadExport() {
        List<Schedule> schedules = this.getAllSchedules();
        ByteArrayInputStream in = ExcelHelper.schedulesToExcelExport(schedules);
        return in;
    }

    public void save(MultipartFile file) {
        try {
            List<Schedule> tutorials = ExcelHelper.excelToSchedules(file.getInputStream());
            tutorials.forEach(el -> {
                if (el != null && !el.getState().equals("Huỷ lớp")) {
                    scheduleRepo.save(el);
                }
            });
        } catch (IOException e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
    }

    public void saveClassOpened(MultipartFile file, String semester) {
        try {
            List<ClassOpened> tutorials = ExcelHelper.excelToClassOpened(file.getInputStream());
            tutorials.forEach(el -> {
                if (el != null && !el.getCourse().isEmpty() && !el.getStudyClass().isEmpty()) {
                    el.setSemester(semester);
                    classOpenedRepo.save(el);
                }
            });
        } catch (IOException e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
    }

    public void saveClassroom(MultipartFile file) {
        try {
            List<Classroom> tutorials = ExcelHelper.excelToClassroom(file.getInputStream());
            tutorials.forEach(el -> {
                if (el != null && !el.getClassroom().isEmpty() && el.getQuantityMax() != null) {
                    classroomRepo.save(el);
                }
            });
        } catch (IOException e) {
            throw new RuntimeException("fail to store excel data: " + e.getMessage());
        }
    }

    public List<Schedule> getAllSchedules() {
        return scheduleRepo.findAll();
    }
}