import {
  Box, Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {request} from "../../../api";
import {useParams} from "react-router";
import {randomImageName,} from "../../../utils/FileUpload/covert";
import {useTranslation} from "react-i18next";
import HustContainerCard from "../../common/HustContainerCard";
import RichTextEditor from "../../common/editor/RichTextEditor";
import HustCodeEditor from "../../common/HustCodeEditor";
import {CUSTOM_EVALUATION} from "./Constant";
import ListTestCase from "./ListTestCase";
import FileUploadZone from "../../../utils/FileUpload/FileUploadZone";
import ContestsUsingAProblem from "./ContestsUsingAProblem";
import EditIcon from "@mui/icons-material/Edit";
import {useHistory} from "react-router-dom";
import {styled} from "@mui/material/styles";
import { PROBLEM_ROLE, PROBLEM_STATUS } from "utils/constants";

const CssTextField = styled(TextField)({
  ".MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "gray",
    color: "gray"
  },
  '& label.Mui-disabled': {
    color: 'gray',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'darkgray',
    },
  },
});

function ManagerViewProblemDetailV2() {
  const {t} = useTranslation(
    ["education/programmingcontest/problem", "common", "validation"]
  );

  const {problemId} = useParams();
  const history = useHistory();

  const [problemName, setProblemName] = useState("");
  const [description, setDescription] = useState("");
  // const [timeLimit, setTimeLimit] = useState(1);
  const [timeLimitCPP, setTimeLimitCPP] = useState(1);
  const [timeLimitJAVA, setTimeLimitJAVA] = useState(1);
  const [timeLimitPYTHON, setTimeLimitPYTHON] = useState(1);
  const [memoryLimit, setMemoryLimit] = useState(1);
  const [levelId, setLevelId] = useState("");
  const [languageSolution, setLanguageSolution] = useState("CPP");
  const [codeSolution, setCodeSolution] = useState("");
  const [solutionCheckerLanguage, setSolutionCheckerLanguage] = useState("CPP");
  const [solutionChecker, setSolutionChecker] = useState("");
  const [isCustomEvaluated, setIsCustomEvaluated] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [fetchedImageArray, setFetchedImageArray] = useState([]);
  const [status, setStatus] = useState("");
  const [roles, setRoles] = useState([]);


  useEffect(() => {
    request("get", "/problem-details/" + problemId, (res) => {
      res = res.data;
      if (res.attachment && res.attachment.length !== 0) {
        const newFileURLArray = res.attachment.map((url) => ({
          id: randomImageName(),
          content: url,
        }));
        newFileURLArray.forEach((file, idx) => {
          file.fileName = res.attachmentNames[idx];
        });
        setFetchedImageArray(newFileURLArray);
      }

      setProblemName(res.problemName);
      setLevelId(res.levelId);
      // setTimeLimit(res.timeLimit);
      setTimeLimitCPP(res.timeLimitCPP);
      setTimeLimitJAVA(res.timeLimitJAVA);
      setTimeLimitPYTHON(res.timeLimitPYTHON);
      setMemoryLimit(res.memoryLimit);
      setIsPublic(res.publicProblem);
      setLanguageSolution(res.correctSolutionLanguage);
      setCodeSolution(res.correctSolutionSourceCode);
      setSolutionCheckerLanguage(res.solutionCheckerLanguage);
      setSolutionChecker(res.solutionCheckerSourceCode || "");
      setIsCustomEvaluated(res.scoreEvaluationType === CUSTOM_EVALUATION);
      setDescription(res.problemDescription);
      setSelectedTags(res.tags);
      setRoles(res.roles);
      setStatus(res.status);
    });
  }, [problemId]);

  return (
    <HustContainerCard
      title={"Problem Detail"}
      action={
        <>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              history.push("/programming-contest/edit-problem/" + problemId);
            }}
            startIcon={<EditIcon sx={{ marginRight: "4px" }} />}
            sx={{ marginRight: "8px" }}
            disabled={!roles.includes(PROBLEM_ROLE.OWNER) && (
              !roles.includes(PROBLEM_ROLE.EDITOR) || status !== PROBLEM_STATUS.OPEN
            )}
          >
            Edit
          </Button>
          {
          roles.includes(PROBLEM_ROLE.OWNER) && <Button
            variant="contained"
            color="info"
            onClick={() => {
              history.push(
                "/programming-contest/user-contest-problem-role-management/" +
                  problemId
              );
            }}
          >
            Manage Role
          </Button>
          }
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <CssTextField
            disabled
            fullWidth
            id="problemName"
            label={t("problemName")}
            value={problemName}
          />
        </Grid>

        <Grid item xs={2}>
          <CssTextField
            disabled
            fullWidth
            id="status"
            label={t("status")}
            value={status}
          />
        </Grid>

        <Grid item xs={2}>
          <CssTextField
            disabled
            fullWidth
            id="levelId"
            label={t("level")}
            value={levelId}
          />
        </Grid>

        <Grid item xs={2}>
          <CssTextField
            disabled
            fullWidth
            id="isPublicProblem"
            label={t("public", {ns: "common"})}
            value={isPublic ? t("yes", {ns: "common"}) : t("no", {ns: "common"})}
          />
        </Grid>

        <Grid item xs={2}>
          <CssTextField
            disabled
            fullWidth
            id="timeLimitCPP"
            label={t("timeLimit") + " - CPP"}
            type="number"
            value={timeLimitCPP}
            InputProps={{endAdornment: <InputAdornment position="end">s</InputAdornment>}}
          />
        </Grid>

        <Grid item xs={2}>
          <CssTextField
            disabled
            fullWidth
            id="timeLimitJAVA"
            label={t("timeLimit") + " - JAVA"}
            type="number"
            value={timeLimitJAVA}
            InputProps={{endAdornment: <InputAdornment position="end">s</InputAdornment>}}
          />
        </Grid>

        <Grid item xs={2}>
          <CssTextField
            disabled
            fullWidth
            id="timeLimitPYTHON"
            label={t("timeLimit") + " - PYTHON"}
            type="number"
            value={timeLimitPYTHON}
            InputProps={{endAdornment: <InputAdornment position="end">s</InputAdornment>}}
          />
        </Grid>

        <Grid item xs={2}>
          <CssTextField
            disabled
            fullWidth
            id="memoryLimit"
            label={t("memoryLimit")}
            type="number"
            value={memoryLimit}
            InputProps={{endAdornment: <InputAdornment position="end">MB</InputAdornment>}}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl sx={{width: "100%"}}>
            <InputLabel id="select-tag-label">Tags</InputLabel>
            <Select
              id="select-tag"
              multiple
              value={selectedTags}
              input={<OutlinedInput label="Tags"/>}
              renderValue={(selectedTags) => (
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.8}}>
                  {selectedTags?.map((selectedTag) => (
                    <Chip size="small" label={selectedTag.name} sx={{
                      marginRight: "6px",
                      marginBottom: "6px",
                      border: "1px solid lightgray",
                      fontStyle: "italic"
                    }}/>
                  ))}
                </Box>
              )}
            >
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{marginTop: "24px", marginBottom: "24px"}}>
        <Typography variant="h5" component="div" sx={{marginBottom: "8px"}}>
          {t("problemDescription")}
        </Typography>
        <RichTextEditor toolbarHidden content={description} onContentChange={text => setDescription(text)}/>
      </Box>

      {fetchedImageArray.length !== 0 &&
        fetchedImageArray.map((file) => (
          <FileUploadZone file={file} removable={false}/>
        ))}

      <Box sx={{marginTop: "28px"}}/>
      <HustCodeEditor
        title={t("correctSourceCode")}
        language={languageSolution}
        sourceCode={codeSolution}
      />

      <Box sx={{marginTop: "24px"}}>
        <FormControlLabel
          label={t("isCustomEvaluated")}
          control={
            <Checkbox
              disabled
              checked={isCustomEvaluated}
            />}
        />

        {isCustomEvaluated &&
          <HustCodeEditor
            title={t("checkerSourceCode")}
            language={solutionCheckerLanguage}
            sourceCode={solutionChecker}
            placeholder={t("checkerSourceCodePlaceholder")}
          />
        }
      </Box>

      <ListTestCase/>

      <ContestsUsingAProblem problemId={problemId}/>
    </HustContainerCard>
  );
}

export default ManagerViewProblemDetailV2;
