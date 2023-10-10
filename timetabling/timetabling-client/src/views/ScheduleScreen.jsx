import React, { useEffect, useState, forwardRef } from "react";
import { request } from "../api";
import MaterialTable, { MTableToolbar } from "material-table";
import { Card, Button, CircularProgress} from "@material-ui/core";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

function ScheduleScreen() {

    const [schedules, setSchedules] = useState([]);
    const [openLoading, setOpenLoading] = React.useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        request("get", "/excel/schedules", (res) => { 
            setSchedules(res.data);
        }).then();
    }, [])

    const columns = [
        {
            title: "Schedule ID",
            field: "id",
        },
        {
            title: "Học kỳ",
            field: "semester",
        },
        {
            title: "Trường",
            field: "institute",
        },
        {
            title: "Mã lớp",
            field: "classCode",
        },
        {
            title: "Mã lớp kèm",
            field: "bundleClassCode",
        },
        {
            title: "Mã học phần",
            field: "moduleCode",
        },
        {
            title: "Tền học phần",
            field: "moduleName",
        },
        {
            title: "Tên học phần bằng TA",
            field: "moduleNameByEnglish",
        },
        {
            title: "Khối lượng",
            field: "mass",
        },
        {
            title: "Ghi chú",
            field: "notes",
        },
        {
            title: "Buổi số",
            field: "sessionNo",
        },
        {
            title: "Thứ",
            field: "weekDay",
        },
        {
            title: "Thời gian",
            field: "studyTime",
        },
        {
            title: "BĐ",
            field: "start",
        },
        {
            title: "KT",
            field: "finish",
        },
        {
            title: "Kíp",
            field: "crew",
        },
        {
            title: "Tuần",
            field: "studyWeek",
        },
        {
            title: "Phòng",
            field: "classRoom",
        },
        {
            title: "Cần TN",
            field: "isNeedExperiment",
        },
        {
            title: "SLĐK",
            field: "numberOfRegistrations",
        },
        {
            title: "SL MAX",
            field: "maxQuantity",
        },
        {
            title: "Trạng thái",
            field: "state",
        },
        {
            title: "Loại lớp",
            field: "classType",
        },
        {
            title: "Đợt mở",
            field: "openBatch",
        },
        {
            title: "Mã QL",
            field: "managementCode",
        },
    ];

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
      };

      async function getAllSchedule() {
        setOpenLoading(true)
        request(
            "GET",
            "/excel/schedule",
            (res) => {
                console.log(res.data.content)
                setOpenLoading(false)
                setSchedules(res.data.content);
            }
        );
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        
        if (file) {
            setUploading(true);

            const formData = new FormData();
            formData.append("file", file);

            try {
                // Use your API endpoint for file upload
                await request(
                    "POST", 
                    "/excel/upload", 
                    (res) => {
                    console.log(res.data);
                    setUploading(false);
                    // You may want to update the table data here
                    getAllSchedule()
                },{

                }
                ,formData, 
                {
                    "Content-Type": "multipart/form-data",
                });
            } catch (error) {
                console.error("Error uploading file:", error);
                setUploading(false);
            }
        }
    };

    return (
        <div>
            <MaterialTable
                title={"Danh sách thời khóa biểu"}
                columns={columns}
                data={schedules}
                icons={tableIcons}
                components={{
                    Toolbar: (props) => (
                        <div style={{
                            position: "relative"
                        }}>
                            <MTableToolbar {...props} />
                            <div
                                style={{ position: "absolute", top: "16px", right: "350px" }}
                            >
                                <input
                                    accept=".xlsx, .xls"
                                    style={{ display: "none" }}
                                    id="fileInput"
                                    type="file"
                                    onChange={handleFileUpload}
                                />
                                <label htmlFor="fileInput">
                                    <Button
                                        variant="contained"
                                        component="span"
                                        color="primary"
                                        disabled={uploading}
                                    >
                                        Import Excel
                                    </Button>
                                </label>
                                {uploading && <CircularProgress size={24} />}
                            </div>
                        </div>
                    ),
                }}
            />
        </div>

    );
}

export default ScheduleScreen;