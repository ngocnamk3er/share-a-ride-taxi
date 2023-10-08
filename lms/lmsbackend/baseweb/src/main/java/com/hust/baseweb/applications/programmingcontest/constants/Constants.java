package com.hust.baseweb.applications.programmingcontest.constants;

import com.hust.baseweb.applications.programmingcontest.utils.ComputerLanguage;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@AllArgsConstructor(onConstructor_ = @Autowired)
@Data
public class Constants {

    private Map<String, Integer> MapLevelOrder = new HashMap<>();

    @Bean
    public void initConstants() {
        MapLevelOrder.put("easy", 1);
        MapLevelOrder.put("medium", 2);
        MapLevelOrder.put("hard", 3);
    }

    public static final String SPLIT_TEST_CASE = "testcasedone";

    public enum RegistrationType {
        PENDING("PENDING"),
        SUCCESSFUL("SUCCESSFUL"),
        FAILED("FAILED");

        private final String value;

        RegistrationType(String value) {
            this.value = value;
        }

        public String getValue() {
            return this.value;
        }
    }


    public enum RegisterCourseStatus {
        SUCCESSES("SUCCESSES"), FAILED("FAILED");

        private final String value;

        RegisterCourseStatus(String value) {
            this.value = value;
        }

        public String getValue() {
            return this.value;
        }
    }

    public enum GetPointForRankingType {
        LATEST("LATEST"), HIGHEST("HIGHEST");

        private final String value;

        GetPointForRankingType(String value) {
            this.value = value;
        }

        public String getValue() {
            return this.value;
        }
    }

    public enum TestCaseSubmissionError {
        FILE_LIMIT("File size limit exceeded"),
        MEMORY_LIMIT("Segmentation fault"),
        TIME_LIMIT("Killed");

        private final String value;

        TestCaseSubmissionError(String value) {
            this.value = value;
        }

        public String getValue() {
            return this.value;
        }
    }

    public enum DockerImage {
        GCC("gcc:13.2.0"), JAVA("openjdk:17.0-jdk-buster"), PYTHON3("python:3.7-bookworm");

        private final String value;

        DockerImage(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }


    public enum DockerContainer {
        GCC("/gcc"), JAVA("/java"), PYTHON3("/python3");

        private final String value;

        DockerContainer(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    public enum ProblemResultEvaluationType {
        NORMAL("NORMAL_EVALUATION"),
        CUSTOM("CUSTOM_EVALUATION");

        private final String value;

        ProblemResultEvaluationType(String value) {
            this.value = value;
        }

        public String getValue() {
            return this.value;
        }
    }

}
