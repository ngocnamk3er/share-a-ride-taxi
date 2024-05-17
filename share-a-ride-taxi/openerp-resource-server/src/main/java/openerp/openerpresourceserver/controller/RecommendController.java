package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.PassengerRequest;
import openerp.openerpresourceserver.enums.RequestStatus;
import openerp.openerpresourceserver.service.Interface.PassengerRequestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/recommend")
@PreAuthorize("hasRole('default-roles-openerp-dev')")
@RequiredArgsConstructor
public class RecommendController {
    private final PassengerRequestService passengerRequestService;

    @GetMapping
    public List<PassengerRequest> getRecommendPassengerRequests() {
        List<PassengerRequest> recommendPassengerRequests = passengerRequestService.getAllPassengerRequests();

        // Tạo một danh sách mới để lưu trữ 3 phần tử ngẫu nhiên
        List<PassengerRequest> randomPassengerRequests = new ArrayList<>();

        // Sử dụng đối tượng Random để chọn ngẫu nhiên 3 vị trí trong danh sách
        Random random = new Random();
        int listSize = recommendPassengerRequests.size();
        for (int i = 0; i < 5; i++) {
            int randomIndex = random.nextInt(listSize);
            PassengerRequest randomPassengerRequest = recommendPassengerRequests.get(randomIndex);
            if (randomPassengerRequest.getStatusId() == RequestStatus.RECEIVED.ordinal()){
                randomPassengerRequests.add(randomPassengerRequest);
            }
        }

        return randomPassengerRequests;
    }
}
