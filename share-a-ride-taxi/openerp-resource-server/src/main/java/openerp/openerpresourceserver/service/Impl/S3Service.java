package openerp.openerpresourceserver.service.Impl;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
public class S3Service {

    // Thông tin về endpoint và credential của Amazon S3
    @Value("${aws.s3.endpointUrl}")
    private String ENDPOINT_URL;

    @Value("${aws.s3.accessKey}")
    private String ACCESS_KEY;

    @Value("${aws.s3.secretKey}")
    private String SECRET_KEY;

    @Value("${aws.s3.bucketName}")
    private String BUCKET_NAME;

    public String uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Khởi tạo Amazon S3 client
            BasicAWSCredentials awsCredentials = new BasicAWSCredentials(ACCESS_KEY, SECRET_KEY);
            AmazonS3 s3Client = AmazonS3ClientBuilder.standard()
                    .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(ENDPOINT_URL, "ap-southeast-2"))
                    .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                    .build();

            // Chuyển đổi MultipartFile thành File
            File convertedFile = convertMultiPartToFile(file);

            // Tải file lên Amazon S3
            String fileName = file.getOriginalFilename();
            s3Client.putObject(new PutObjectRequest(BUCKET_NAME, fileName, convertedFile));

            // Xóa file tạm sau khi đã upload
            convertedFile.delete();

            // Trả về URL của file đã upload
            String fileUrl = s3Client.getUrl(BUCKET_NAME, fileName).toString();
            return fileUrl;
        } catch (AmazonServiceException e) {
            return  e.getMessage();
        } catch (SdkClientException e) {
            return e.getMessage();
        } catch (IOException e) {
            return e.getMessage();
        }
    }



    private File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        }
        return convertedFile;
    }
}
