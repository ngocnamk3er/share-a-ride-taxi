export const NORMAL_EVALUATION = "NORMAL_EVALUATION";
export const CUSTOM_EVALUATION = "CUSTOM_EVALUATION";

export const SUBMISSION_MODE_SOURCE_CODE = "SUBMISSION_MODE_SOURCE_CODE";
export const SUBMISSION_MODE_SOLUTION_OUTPUT = "SUBMISSION_MODE_SOLUTION_OUTPUT";
export const SUBMISSION_MODE_NOT_ALLOWED = "SUBMISSION_MODE_NOT_ALLOWED";

export const getSubmissionModeFromConstant = (mode) => {
  switch (mode) {
    case SUBMISSION_MODE_SOURCE_CODE:
      return "Normal";
    case SUBMISSION_MODE_SOLUTION_OUTPUT:
      return "Submit only output";
    case SUBMISSION_MODE_NOT_ALLOWED:
      return "NOT allow submitting";
    default:
      return "NORMAL";
  }
}

export const COMPUTER_LANGUAGES = Object.freeze({
  C: 'C',
  CPP11: 'CPP11',
  CPP14: 'CPP14',
  CPP17: 'CPP17',
  JAVA: 'JAVA',
  PYTHON: 'PYTHON3'
})

export const mapLanguageToDisplayName = (language) => {
  switch (language) {
    case COMPUTER_LANGUAGES.C:
      return "C 17";
    case COMPUTER_LANGUAGES.CPP11:
      return "C++ 11";
    case COMPUTER_LANGUAGES.CPP14:
      return "C++ 14";
    case COMPUTER_LANGUAGES.CPP17:
      return "C++ 17";
    case COMPUTER_LANGUAGES.JAVA:
      return "JAVA 13";
    case COMPUTER_LANGUAGES.PYTHON:
      return "PYTHON 3.6.15";
    default:
      return language;
  }
}

export const DEFAULT_CODE_SEGMENT_CPP = "//C/C++ \n" +
  "#include <bits/stdc++.h> \n\n" +
  "int main() \n" +
  "{ \n\n" +
  "}";

export const DEFAULT_CODE_SEGMENT_JAVA = "//JAVA \n" +
  "import java.util.*; \n\n" +
  "@SuppressWarnings({\"unchecked\", \"deprecation\"})\n" +
  "public class Main { \n" +
  "    public static void main(String[] args) { \n\n" +
  "    }\n" +
  "}";

export const DEFAULT_CODE_SEGMENT_PYTHON = "#PYTHON \n";