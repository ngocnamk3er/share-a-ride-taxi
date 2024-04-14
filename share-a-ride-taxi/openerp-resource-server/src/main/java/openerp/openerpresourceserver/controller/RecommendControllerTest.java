package openerp.openerpresourceserver.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/recommend")
public class RecommendControllerTest {

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
}
