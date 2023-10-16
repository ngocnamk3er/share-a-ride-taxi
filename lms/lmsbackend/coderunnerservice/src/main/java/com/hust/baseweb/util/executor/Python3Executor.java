package com.hust.baseweb.util.executor;


import com.hust.baseweb.applications.programmingcontest.entity.TestCaseEntity;
import com.hust.baseweb.constants.Constants;
import org.apache.commons.lang3.RandomStringUtils;

import java.util.ArrayList;
import java.util.List;

public class Python3Executor {
    private static final String suffixes = ".py";
    private static final String SHFileStart = "#!/bin/bash\n";
    private static final String buildCmd = "python3 -m py_compile main.py";
    private static final String SOURCECODE_DELIMITER = "PYTHON_FILE" + RandomStringUtils.randomAlphabetic(10);
    ;

    private static final String TIME_LIMIT_ERROR = Constants.TestCaseSubmissionError.TIME_LIMIT.getValue();
    private static final String FILE_LIMIT_ERROR = Constants.TestCaseSubmissionError.FILE_LIMIT.getValue();
    private static final String MEMORY_LIMIT_ERROR = Constants.TestCaseSubmissionError.MEMORY_LIMIT.getValue();

    public Python3Executor() {

    }

    public String generateScriptFileWithTestCaseAndCorrectSolution(String source, String testCase, String tmpName, int timeLimit) {

        List<TestCaseEntity> testCaseEntities = new ArrayList<>();
        TestCaseEntity testCaseEntity = new TestCaseEntity();
        testCaseEntity.setTestCase(testCase);
        testCaseEntities.add(testCaseEntity);

        return genSubmitScriptFile(testCaseEntities, source, tmpName, timeLimit, 10);
    }

    public String genSubmitScriptFile(List<TestCaseEntity> testCases, String source, String tmpName, int timeLimit, int memoryLimit) {
        StringBuilder genTestCase = new StringBuilder();
        for (int i = 0; i < testCases.size(); i++) {
            String testcase = "cat <<'" + SOURCECODE_DELIMITER + "' >> testcase" + i + ".txt \n"
                    + testCases.get(i).getTestCase() + "\n"
                    + SOURCECODE_DELIMITER + "\n";
            genTestCase.append(testcase);
        }

        String outputFileName = tmpName + "_output.txt";
        String errorFileName = tmpName + "_error.txt";

        String[] lines = {
                SHFileStart,
                "mkdir -p " + tmpName,
                "cd " + tmpName,
                "cat <<'" + SOURCECODE_DELIMITER + "' >> main" + suffixes,
                source,
                SOURCECODE_DELIMITER,
                buildCmd,
                "if  [ -d __pycache__ ]; then",
                genTestCase.toString(),
                "n=0",
                "start=$(date +%s%N)",
                "while [ \"$n\" -lt " + testCases.size() + " ]",
                "do",
                "f=\"testcase\"$n\".txt\"",
                "cat $f | (ulimit -t " + timeLimit
                        // + " -v " + (memoryLimit * 1024)
                        + " -f 25000; "
                        + "python3 main.py > " + outputFileName + " 2>&1; ) &> " + errorFileName,
                "ERROR=$(head -1 " + errorFileName + ")",
                "FILE_LIMIT='" + FILE_LIMIT_ERROR + "'",
                "TIME_LIMIT='" + TIME_LIMIT_ERROR + "'",
                "MEMORY_LIMIT='" + MEMORY_LIMIT_ERROR + "'",
                "case $ERROR in",
                "*\"$FILE_LIMIT\"*)",
                "echo $FILE_LIMIT",
                ";;",
                "*\"$TIME_LIMIT\"*)",
                "echo $TIME_LIMIT",
                ";;",
                "*\"$MEMORY_LIMIT\"*)",
                "echo $MEMORY_LIMIT",
                ";;",
                "*)",
                "cat " + outputFileName,
                ";;",
                "esac",
                "echo " + Constants.SPLIT_TEST_CASE,
                "n=`expr $n + 1`",
                "done",
                "end=$(date +%s%N)",
                "echo",
                "echo \"$(($(($end-$start))/1000000))\"",
                "echo successful",
                "else",
                "echo Compile Error",
                "fi",
                "cd ..",
                "rm -rf " + tmpName + " &",
                "rm -rf " + tmpName + ".sh &",
                "rm -rf " + tmpName
        };

        String sourceSH = String.join("\n", lines);
        return sourceSH;
    }
}
