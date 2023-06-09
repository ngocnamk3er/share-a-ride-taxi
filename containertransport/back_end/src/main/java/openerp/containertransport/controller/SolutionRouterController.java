package openerp.containertransport.controller;

import lombok.RequiredArgsConstructor;
import openerp.containertransport.constants.MetaData;
import openerp.containertransport.dto.ShipmentModel;
import openerp.containertransport.dto.metaData.MetaDTO;
import openerp.containertransport.dto.metaData.ResponseMetaData;
import openerp.containertransport.service.AutoSolutionRouterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/solution")
public class SolutionRouterController {
    private final AutoSolutionRouterService autoSolutionRouterService;
    @GetMapping("/create")
    public ResponseEntity<?> autoCreatedSolution() {
        ShipmentModel shipmentModelCreate = autoSolutionRouterService.autoSolutionRouter();
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMetaData(new MetaDTO(MetaData.SUCCESS), shipmentModelCreate));
    }
}