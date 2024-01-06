import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { LoadingButton } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { Grid, InputAdornment, LinearProgress } from "@mui/material";
import TextField from "@mui/material/TextField";
import { request } from "api";
import StyledSelect from "component/select/StyledSelect";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { errorNoti, successNoti } from "utils/notification";
import HustContainerCard from "../../common/HustContainerCard";

export default function EditContest() {
  const { t } = useTranslation([
    "education/programmingcontest/contest",
    "common",
    "validation",
  ]);

  const { contestId } = useParams();

  const [loading, setLoading] = useState(true);

  const [contestName, setContestName] = useState("");
  const [contestTime, setContestTime] = useState(Number(0));

  const [startDate, setStartDate] = React.useState(new Date());
  const [countDown, setCountDown] = useState(Number(0));

  const [options, setOptions] = useState({
    status: [],
    submissionActionType: [],
    participantViewResultMode: [],
    problemDescriptionViewType: [],
    evaluateBothPublicPrivateTestcase: [],
    participantViewSubmissionMode: [],
    supportedLanguage: [],
  });

  const [status, setStatus] = useState("");
  const [submissionActionType, setSubmissionActionType] = useState("");
  const [maxNumberSubmission, setMaxNumberSubmission] = useState(10);
  const [participantViewResultMode, setParticipantViewResultMode] =
    useState("");
  const [problemDescriptionViewType, setProblemDescriptionViewType] =
    useState("");
  const [
    evaluateBothPublicPrivateTestcase,
    setEvaluateBothPublicPrivateTestcase,
  ] = useState("");
  const [maxSourceCodeLength, setMaxSourceCodeLength] = useState(50000);
  const [minTimeBetweenTwoSubmissions, setMinTimeBetweenTwoSubmissions] =
    useState(0);
  const [judgeMode, setJudgeMode] = useState("");
  const [participantViewSubmissionMode, setParticipantViewSubmissionMode] =
    useState(null);
  const [allowedLanguages, setAllowedLanguages] = useState([]);

  const handleSubmit = () => {
    // setLoading(true);

    let body = {
      contestName: contestName,
      contestSolvingTime: contestTime,
      startedAt: startDate,
      countDownTime: countDown,
      statusId: status,
      submissionActionType: submissionActionType,
      maxNumberSubmission: maxNumberSubmission,
      participantViewResultMode: participantViewResultMode,
      problemDescriptionViewType: problemDescriptionViewType,
      maxSourceCodeLength: maxSourceCodeLength,
      evaluateBothPublicPrivateTestcase: evaluateBothPublicPrivateTestcase,
      minTimeBetweenTwoSubmissions: minTimeBetweenTwoSubmissions,
      judgeMode: judgeMode,
      participantViewSubmissionMode: participantViewSubmissionMode,
      languagesAllowed: allowedLanguages,
    };

    request(
      "put",
      "/contests/" + contestId,
      () => {
        successNoti("Contest updated", 3000);
        // getContestInfo();
      },
      {
        onError: () => errorNoti(t("error", { ns: "common" }), 3000),
      },
      body
    );
  };

  function getContestInfo() {
    request("get", "/contests/" + contestId, (res) => {
      setLoading(false);

      const data = res.data;

      setOptions({
        status: data.listStatusIds.map((status) => ({
          label: status,
          value: status,
        })),
        submissionActionType: data.listSubmissionActionTypes.map((type) => ({
          label: type,
          value: type,
        })),
        participantViewResultMode: data.listParticipantViewModes.map(
          (mode) => ({
            label: mode,
            value: mode,
          })
        ),
        problemDescriptionViewType: data.listProblemDescriptionViewTypes.map(
          (type) => ({
            label: type,
            value: type,
          })
        ),
        evaluateBothPublicPrivateTestcase:
          data.listEvaluateBothPublicPrivateTestcases.map((option) => ({
            label: option,
            value: option,
          })),
        participantViewSubmissionMode:
          data.listParticipantViewSubmissionModes.map((mode) => ({
            label: mode,
            value: mode,
          })),
        supportedLanguage: data.listLanguagesAllowed.map((language) => ({
          label: language,
          value: language,
        })),
      });

      setContestTime(data.contestTime);
      setContestName(data.contestName);
      setStartDate(data.startAt);
      setStatus(data.statusId);
      setSubmissionActionType(data.submissionActionType);
      setParticipantViewResultMode(data.participantViewResultMode);
      setMaxNumberSubmission(data.maxNumberSubmission);
      setProblemDescriptionViewType(data.problemDescriptionViewType);
      setMinTimeBetweenTwoSubmissions(data.minTimeBetweenTwoSubmissions);
      setJudgeMode(data.judgeMode);
      setEvaluateBothPublicPrivateTestcase(
        data.evaluateBothPublicPrivateTestcase
      );
      setMaxSourceCodeLength(data.maxSourceCodeLength);
      setParticipantViewSubmissionMode(data.participantViewSubmissionMode);
      setAllowedLanguages(
        !data.languagesAllowed || _.isEmpty(data.languagesAllowed.trim())
          ? []
          : data.languagesAllowed.split(",")
      );
    });
  }

  useEffect(() => {
    getContestInfo();
  }, []);

  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <HustContainerCard title={contestId}>
          {loading ? (
            <LinearProgress />
          ) : (
            <>
              <Grid
                container
                rowSpacing={3}
                spacing={2}
                display={loading ? "none" : ""}
              >
                {[
                  <TextField
                    required
                    fullWidth
                    autoFocus
                    size="small"
                    id="contestName"
                    label="Contest name"
                    value={contestName}
                    onChange={(event) => {
                      setContestName(event.target.value);
                    }}
                  />,
                  <StyledSelect
                    fullWidth
                    id="statusId"
                    key={"statusId"}
                    label="Status"
                    value={status}
                    options={options.status}
                    onChange={(event) => {
                      setStatus(event.target.value);
                    }}
                  />,
                  <StyledSelect
                    fullWidth
                    id="problemDescriptionViewType"
                    label="View problem description"
                    key={"problemDescriptionViewType"}
                    value={problemDescriptionViewType}
                    options={options.problemDescriptionViewType}
                    onChange={(event) => {
                      setProblemDescriptionViewType(event.target.value);
                    }}
                  />,
                  <TextField
                    required
                    fullWidth
                    type="number"
                    size="small"
                    id="maxSubmissions"
                    label="Max submissions"
                    value={maxNumberSubmission}
                    onChange={(event) => {
                      setMaxNumberSubmission(event.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          per problem
                        </InputAdornment>
                      ),
                    }}
                  />,
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    id="maxSourceCodeLength"
                    label="Source length limit"
                    value={maxSourceCodeLength}
                    onChange={(event) => {
                      setMaxSourceCodeLength(event.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">chars</InputAdornment>
                      ),
                    }}
                  />,
                  <TextField
                    fullWidth
                    type="number"
                    size="small"
                    id="submissionInterval"
                    label="Submission interval"
                    value={minTimeBetweenTwoSubmissions}
                    onChange={(event) => {
                      setMinTimeBetweenTwoSubmissions(
                        Number(event.target.value)
                      );
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">s</InputAdornment>
                      ),
                    }}
                  />,
                  <StyledSelect
                    fullWidth
                    multiple
                    id="languages"
                    key={"languages"}
                    label="Programming languages"
                    SelectProps={{ multiple: true }}
                    value={allowedLanguages}
                    helperText="Leave blank to allow all supported languages"
                    options={options.supportedLanguage}
                    onChange={(event) => {
                      setAllowedLanguages(event.target.value);
                    }}
                  />,
                  <StyledSelect
                    fullWidth
                    id="submissionActionType"
                    label="Action on submission"
                    key={"submissionActionType"}
                    value={submissionActionType}
                    options={options.submissionActionType}
                    onChange={(event) => {
                      setSubmissionActionType(event.target.value);
                    }}
                  />,
                  <StyledSelect
                    fullWidth
                    id="evaluateBothPublicPrivateTestcase"
                    label="Evaluate private testcases"
                    key={"evaluateBothPublicPrivateTestcase"}
                    value={evaluateBothPublicPrivateTestcase}
                    options={options.evaluateBothPublicPrivateTestcase}
                    onChange={(event) => {
                      setEvaluateBothPublicPrivateTestcase(event.target.value);
                    }}
                  />,
                  <StyledSelect
                    fullWidth
                    id="participantViewResultMode"
                    label="View testcase detail"
                    key={"participantViewResultMode"}
                    value={participantViewResultMode}
                    options={options.participantViewResultMode}
                    onChange={(event) => {
                      setParticipantViewResultMode(event.target.value);
                    }}
                  />,
                  <StyledSelect
                    fullWidth
                    id="participantViewSubmissionMode"
                    label="Participant view submission"
                    key={"participantViewSubmissionMode"}
                    value={participantViewSubmissionMode}
                    options={options.participantViewSubmissionMode}
                    onChange={(event) => {
                      setParticipantViewSubmissionMode(event.target.value);
                    }}
                  />,
                ].map((input, index) => (
                  <Grid item sm={12} md={4} key={index}>
                    {input}
                  </Grid>
                ))}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Date&Time picker"
                    value={startDate}
                    onChange={(value) => {
                      setStartDate(value);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <LoadingButton
                loading={loading}
                variant="contained"
                sx={{ textTransform: "none", mt: 4 }}
                onClick={handleSubmit}
              >
                Save
              </LoadingButton>
            </>
          )}
        </HustContainerCard>
      </MuiPickersUtilsProvider>
    </div>
  );
}
