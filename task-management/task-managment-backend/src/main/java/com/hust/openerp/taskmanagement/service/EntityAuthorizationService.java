package com.hust.openerp.taskmanagement.service;

import java.util.List;
import java.util.Set;

public interface EntityAuthorizationService {

  Set<String> getEntityAuthorization(String id, List<String> roleIds);

}
