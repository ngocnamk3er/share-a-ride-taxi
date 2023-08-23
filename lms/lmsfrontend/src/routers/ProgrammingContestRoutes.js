import React from "react";
import {Route, Switch, useRouteMatch} from "react-router";
import {ContestManager} from "../component/education/programmingcontestFE/ContestManager";
import ContestProblemSubmissionDetail from "../component/education/programmingcontestFE/ContestProblemSubmissionDetail";
import ContestProblemSubmissionDetailViewedByManager
  from "../component/education/programmingcontestFE/ContestProblemSubmissionDetailViewedByManager";
import AllContestsManager from "../component/education/programmingcontestFE/AllContestsManager";
import CreateContest from "../component/education/programmingcontestFE/CreateContest";
import CreateProblem from "../component/education/programmingcontestFE/CreateProblem";
import CreateTestCase from "../component/education/programmingcontestFE/CreateTestCase";
import UserContestProblemRole from "../component/education/programmingcontestFE/UserContestProblemRole";
import EditContest from "../component/education/programmingcontestFE/EditContest";
import EditProblem from "../component/education/programmingcontestFE/EditProblem";
import EditTestCase from "../component/education/programmingcontestFE/EditTestCase";
import {ListContestManager} from "../component/education/programmingcontestFE/ListContestManager";
import ListProblemV2 from "../component/education/programmingcontestFE/ListProblemV2";
import {StudentContestNotRegistered} from "../component/education/programmingcontestFE/StudentContestNotRegistered";
import {StudentContestRegistered} from "../component/education/programmingcontestFE/StudentContestRegistered";
import StudentViewContestDetail from "../component/education/programmingcontestFE/StudentViewContestDetail";
import StudentViewProgrammingContestProblemDetailV2
  from "../component/education/programmingcontestFE/StudentViewProgrammingContestProblemDetailV2";
import SubmitSolutionOutput from "../component/education/programmingcontestFE/SubmitSolutionOutput";
import SuggestProblem from "../component/education/programmingcontestFE/SuggestProblem";
import ManagerViewProblemDetailV2 from "../component/education/programmingcontestFE/ManagerViewProblemDetailV2";

export default function ProgrammingContestRoutes() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={ListProblemV2} path={`${path}/list-problems`} />
        <Route component={CreateProblem} path={`${path}/create-problem`} />
        <Route component={SuggestProblem} path={`${path}/suggest-problem`} />
        <Route
          component={EditProblem}
          path={`${path}/edit-problem/:problemId`}
        />
        <Route
          component={CreateTestCase}
          path={`${path}/problem-detail-create-test-case/:problemId`}
        />
        <Route
          component={UserContestProblemRole}
          path={`${path}/user-contest-problem-role-management/:problemId`}
        />
        <Route component={CreateContest} path={`${path}/create-contest`} />
        <Route
          component={StudentViewContestDetail}
          path={`${path}/student-view-contest-detail/:contestId`}
        />
        {/* <Route
          component={StudentViewProgrammingContestProblemDetail}
          path={`${path}/student-view-contest-problem-detail/:contestId/:problemId`}
        /> */}
        <Route
          component={StudentViewProgrammingContestProblemDetailV2}
          path={`${path}/student-view-contest-problem-detail/:contestId/:problemId`}
        />
        <Route
          component={ManagerViewProblemDetailV2}
          path={`${path}/manager-view-problem-detail/:problemId`}
        />

        <Route
          component={SubmitSolutionOutput}
          path={`${path}/submit-solution-output/:contestId/:problemId/:testCaseId`}
        />

        <Route
          component={StudentContestNotRegistered}
          path={`${path}/student-list-contest-not-registered`}
        />
        <Route
          component={StudentContestRegistered}
          path={`${path}/student-list-contest-registered`}
        />
        <Route
          component={ListContestManager}
          path={`${path}/teacher-list-contest-manager`}
        />
        <Route
          component={AllContestsManager}
          path={`${path}/list-all-contests`}
        />

        <Route
          component={ContestManager}
          path={`${path}/contest-manager/:contestId`}
        />
        <Route
          component={EditContest}
          path={`${path}/contest-edit/:contestId`}
        />
        <Route
          component={EditTestCase}
          path={`${path}/edit-testcase/:problemId/:testCaseId`}
        />

        <Route
          component={ContestProblemSubmissionDetail}
          path={`${path}/contest-problem-submission-detail/:problemSubmissionId`}
        />
        <Route
          component={ContestProblemSubmissionDetailViewedByManager}
          path={`${path}/manager-view-contest-problem-submission-detail/:problemSubmissionId`}
        />
      </Switch>
    </div>
  );
}
