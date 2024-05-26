package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import openerp.openerpresourceserver.service.Impl.Object.RoutingEstimate;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
public class GraphhopperService {

    @Value("${graphhopper.api.key}")
    private String graphhopperApiKey;

    public RoutingEstimate getRoutingEstimate(Coordinate point1, Coordinate point2) {
        // Lấy tọa độ của điểm 1 và điểm 2 từ hai đối tượng Coordinates được truyền vào
        BigDecimal latitude1 = point1.getLatitude();
        BigDecimal longitude1 = point1.getLongitude();
        BigDecimal latitude2 = point2.getLatitude();
        BigDecimal longitude2 = point2.getLongitude();

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
        BigDecimal distance = firstPathObject.getBigDecimal("distance");

        // Lấy giá trị time từ đối tượng firstPathObject
        int time = firstPathObject.getInt("time");

        System.out.println("Distance");
        System.out.println(distance);

        // Trả về đối tượng DistanceResult
        return new RoutingEstimate(distance, time);
    }

}
