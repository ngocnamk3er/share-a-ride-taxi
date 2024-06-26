package com.hust.openerp.taskmanagement.dto.form;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TaskStatusForm {

    private String statusId;
    private String assignee;
    private Date dueDate;
}
