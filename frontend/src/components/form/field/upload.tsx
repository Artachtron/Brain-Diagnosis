"use client";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button, FormControl, LinearProgress, CardMedia } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Typography } from "@mui/material";
import { List, ListItem } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DoneIcon from "@mui/icons-material/Done";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";
import { uploadFileWithProgress } from "@/utils/backend";
import FileProgressBar from "./file_progress_bar";

interface DropzoneProps {
  label: string;
  files: string[];
  setFiles: React.Dispatch<React.SetStateAction<string[]>>;
  analyzed?: number;
  multiple?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({
  label,
  files = [],
  setFiles,
  analyzed = 0,
  multiple = true,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const [statuses, setStatuses] = useState([0]);
  const [uploadStatus, setUploadStatus] = useState("select");
  const filesToProcess =
    acceptedFiles.length > 0
      ? multiple
        ? acceptedFiles
        : [acceptedFiles[0]]
      : [];

  const setStatusesRef = useRef(setStatuses);

  // Keep the ref updated with the latest setStatuses function
  useEffect(() => {
    setStatusesRef.current = setStatuses;
  }, [setStatuses]);

  useEffect(() => {
    if (analyzed === 0) {
      setStatuses([0]);
      return;
    }

    let uploadedStatus = 50;
    let completedStatus = 100;

    setStatuses((prevStatuses) => {
      let newStatuses = [...prevStatuses]; // create a copy of the array

      // Set the status of the previous index to completedStatus
      if (analyzed > 0) {
        newStatuses[analyzed - 1] = completedStatus;
      }

      // If the current index doesn't exist in the array, add it
      if (analyzed >= newStatuses.length) {
        newStatuses.push(uploadedStatus);
      } else {
        // If the current index exists in the array, update its status to uploadedStatus
        newStatuses[analyzed] = uploadedStatus;
      }

      return newStatuses;
    });
  }, [analyzed]);

  const filesProgress = (progress) => {
    return (progress / filesToProcess.length) * 100;
  };
  const fileProgressValue = filesProgress(analyzed);

  return (
    <FormControl fullWidth>
      {/* <label className="text-gray-500">{label}</label> */}
      <Box
        {...getRootProps({
          className: `flex flex-col items-center justify-center border-2 border-dashed border-purple-700 rounded-xl p-2 cursor-pointer mb-2 bg-cyan-100`,
        })}
      >
        <Box className="flex flex-col items-center justify-center mb-5">
          <Box className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
            <UploadFileIcon color="primary" style={{ fontSize: 40 }} />
          </Box>
          <Typography variant="body1" color="primary" className="text-center">
            Drag and Drop
          </Typography>
        </Box>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          disabled={uploadStatus === "uploading"}
        >
          Upload File
          <input {...getInputProps()} />
        </Button>

        <aside></aside>
      </Box>
      {/* Progress status */}
      {filesToProcess.length > 0 && (
        <Box className="flex flex-col justify-center border-2 border-purple-700 rounded-xl p-1 mb-2 bg-cyan-100 min-h-[100px]">
          {filesToProcess.length > 0 && (
            <Box>
              <Box className="mt-3 ml-5 mr-5">
                {/* <LinearProgress variant="determinate" value={fileProgressValue} /> */}
                <FileProgressBar
                  value={fileProgressValue}
                  fileCount={filesToProcess.length}
                />
              </Box>
              <Box className="flex justify-between"></Box>
            </Box>
          )}
          <List className="grid grid-cols-2 gap-1">
            {filesToProcess.map((file, index) => {
              const status = statuses[index] || 0;
              return (
                <ListItem key={index} className="pl-1 pr-1 pb-1 pt-0">
                  <ListItemIcon>
                    <CardMedia
                      component="img"
                      alt="Uploaded File"
                      src={URL.createObjectURL(file)}
                      title="Uploaded File"
                      className="w-10 h-10 object-cover mr-0"
                    />
                  </ListItemIcon>
                  <Box width={1}>
                    <Box>
                      <Typography className="m-0" color="primary">
                        {file.name}
                      </Typography>
                    </Box>
                    <Box className="flex items-center m-0">
                      <Box className="w-full h-1 bg-gray-200 rounded-full">
                        <LinearProgress variant="determinate" value={status} />
                      </Box>
                      <Box className="ml-2 w-3 h-3 rounded-full bg-white flex items-center justify-center">
                        {status < 100 ? (
                          <Typography
                            color="primary"
                            style={{ fontSize: "8px" }}
                          >{`${status}%`}</Typography>
                        ) : status === 100 ? (
                          <DoneIcon color="primary" style={{ fontSize: 10 }} />
                        ) : null}
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}
    </FormControl>
  );
};

export default Dropzone;
