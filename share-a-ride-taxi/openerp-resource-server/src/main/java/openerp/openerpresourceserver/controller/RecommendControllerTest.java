package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.entity.PassengerRequest;
import openerp.openerpresourceserver.service.Impl.GraphhopperService;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import openerp.openerpresourceserver.service.Impl.Object.RoutingEstimate;
import openerp.openerpresourceserver.service.ParcelRequestService;
import openerp.openerpresourceserver.service.PassengerRequestService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/recommend")
@RequiredArgsConstructor
public class RecommendControllerTest {
    private final ParcelRequestService parcelRequestService;
    private final PassengerRequestService passengerRequestService;
    private final GraphhopperService graphhopperService;
    @Value("${graphhopper.api.key}")
    private String graphhopperApiKey;
    @GetMapping()
    public List<Integer> getRandomNumbers() {
        // Tạo một danh sách để lưu trữ các số ngẫu nhiên
        List<Integer> randomNumbers = new ArrayList<>();

        // Tạo một đối tượng Random
        Random random = new Random();

        // Tạo 5 số ngẫu nhiên từ 1 đến 10 và thêm vào danh sách
        for (int i = 0; i < 5; i++) {
            int randomNumber = random.nextInt(10) + 1; // Số ngẫu nhiên từ 1 đến 10
            randomNumbers.add(randomNumber);
        }

        // Trả về danh sách các số ngẫu nhiên
        return randomNumbers;
    }

    @GetMapping("/addData")
    public String getAddData() {
        List<PassengerRequest> requests = passengerRequestService.getAllPassengerRequests();
        for (PassengerRequest request : requests) {
            RoutingEstimate routingEstimate =
                    graphhopperService.getRoutingEstimate(new Coordinate(request.getPickupLatitude(), request.getPickupLongitude()),
                            new Coordinate(request.getDropoffLatitude(), request.getDropoffLongitude()));
            System.out.println("===========");
            request.setDistance(routingEstimate.getDistance());
            request.setEndTime(request.getRequestTime().plusSeconds(routingEstimate.getTime()/1000));
            passengerRequestService.savePassengerRequest(request);
            System.out.println(routingEstimate.getDistance());
            System.out.println(routingEstimate.getTime());
        }
        return "OK";
    }

    @GetMapping("/addData2")
    public String getAddData2() {
        List<ParcelRequest> requests = parcelRequestService.getAllParcelRequests();
        for (ParcelRequest request : requests) {
            RoutingEstimate routingEstimate =
                    graphhopperService.getRoutingEstimate(new Coordinate(request.getPickupLatitude(), request.getPickupLongitude()),
                            new Coordinate(request.getDropoffLatitude(), request.getDropoffLongitude()));
            System.out.println("===========");
            request.setDistance(routingEstimate.getDistance());
            request.setEndTime(request.getRequestTime().plusSeconds(routingEstimate.getTime()/1000));
            parcelRequestService.createParcelRequest(request);
            System.out.println(routingEstimate.getDistance());
            System.out.println(routingEstimate.getTime());
        }
        return "OK";
    }

    @GetMapping("/distance")
    public String getDistance() {
        // Tọa độ của điểm 1
        double latitude1 = 51.131;
        double longitude1 = 12.414;

        // Tọa độ của điểm 2
        double latitude2 = 48.224;
        double longitude2 = 3.867;

        // Khởi tạo RestTemplate
        RestTemplate restTemplate = new RestTemplate();

        // Tạo URL với các thông số tọa độ
        String url = String.format("https://graphhopper.com/api/1/route?point=%.3f,%.3f&point=%.3f,%.3f&profile=car&locale=de&calc_points=false&key=%s",
                latitude1, longitude1, latitude2, longitude2, graphhopperApiKey);

        // Thực hiện yêu cầu GET và lấy phản hồi dưới dạng String
        ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);

        // Lấy phản hồi từ ResponseEntity
        String responseBody = responseEntity.getBody();

        // Phân tích dữ liệu JSON từ phản hồi
        JSONObject jsonObject = new JSONObject(responseBody);

        // Lấy mảng paths từ đối tượng JSON
        JSONArray pathsArray = jsonObject.getJSONArray("paths");

        // Lấy đối tượng JSON đầu tiên từ mảng paths (giả sử chỉ có một đối tượng)
        JSONObject firstPathObject = pathsArray.getJSONObject(0);

        // Lấy giá trị distance từ đối tượng firstPathObject
        double distance = firstPathObject.getDouble("distance");

        // Lấy giá trị time từ đối tượng firstPathObject
        int time = firstPathObject.getInt("time");

        // Tạo đối tượng JSONObject mới để lưu trữ distance và time
        JSONObject result = new JSONObject();
        result.put("distance", distance);
        result.put("time", time);

        // Trả về kết quả dưới dạng chuỗi JSON
        return result.toString();
    }
}
