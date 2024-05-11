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
  progress?: number;
  setProgress?: React.Dispatch<React.SetStateAction<number>>;
  multiple?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({
  label,
  files = [],
  setFiles,
  analyzed = 0,
  progress,
  setProgress,
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
  const [shouldUpdateProgress, setShouldUpdateProgress] = useState(false);
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

    setStatusesRef.current((prevStatuses) =>
      Array.from({ length: analyzed + 1 }, (_, index) => {
        if (index < prevStatuses.length) {
          return prevStatuses[index];
        } else {
          return 0; // default value for non-existing indices
        }
      })
    );

    const intervalId = setInterval(() => {
      setStatusesRef.current((prevStatuses) =>
        prevStatuses.map((status, index) => {
          if (index === analyzed) {
            // Check if the previous status has reached its final value
            if (index > 0 && prevStatuses[index - 1] < completedStatus) {
              return status;
            }
            const newStatus = Math.min(status + 10, uploadedStatus);
            return newStatus;
          } else if (index < analyzed) {
            // Check if the previous status has reached its final value
            if (index > 0 && prevStatuses[index - 1] < completedStatus) {
              return status;
            }
            const newStatus = Math.min(status + 10, completedStatus);
            // Check if the status has just reached completedStatus and increment progress
            if (newStatus === completedStatus && status < completedStatus) {
              setShouldUpdateProgress(true);
            }
            return newStatus;
          } else {
            return status;
          }
        })
      );
    }, 5);

    return () => clearInterval(intervalId);
  }, [analyzed]);

  useEffect(() => {
    if (shouldUpdateProgress) {
      setProgress((prevProgress) => prevProgress + 1);
      setShouldUpdateProgress(false);
    }
  }, [shouldUpdateProgress]);

  const filesProgress = (progress) => {
    return (progress / filesToProcess.length) * 100;
  };
  const fileProgressValue = filesProgress(progress);

  return (
    <FormControl fullWidth>
      <label className="text-gray-500">{label}</label>
      <Box
        {...getRootProps({
          className: `flex flex-col items-center justify-center border-2 border-dashed border-purple-700 rounded-xl p-5 cursor-pointer mb-2 bg-cyan-100`,
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
      <Box className="flex flex-col justify-center border-2 border-purple-700 rounded-xl p-1  mb-2 bg-cyan-100 min-h-[100px]">
        {filesToProcess.length > 0 && (
          <Box>
            <Box className="mt-3 ml-5 mr-5">
              {/* <LinearProgress variant="determinate" value={fileProgressValue} /> */}
              <FileProgressBar
                value={fileProgressValue}
                fileCount={filesToProcess.length}
              />
            </Box>
            <Box className="flex justify-between">
              {/* {fileProgressValue < 100 ? (
                <Typography color="primary" className="text-xs">
                  {`Uploading ${progress}/${filesToProcess.length}`}
                </Typography>
              ) : (
                <Typography color="primary" className="text-xs">
                  {`Uploaded ${progress}/${filesToProcess.length}`}
                </Typography>
              )} */}
            </Box>
          </Box>
        )}
        <List>
          {filesToProcess.map((file, index) => {
            const status = statuses[index] || 0;
            return (
              <ListItem key={index}>
                <ListItemIcon>
                  <CardMedia
                    component="img"
                    alt="Uploaded File"
                    src={URL.createObjectURL(file)}
                    title="Uploaded File"
                    className="w-24 h-24 object-cover mr-4"
                  />
                </ListItemIcon>
                <Box width={1}>
                  <Box>
                    <Typography color="primary">{file.name}</Typography>
                  </Box>
                  <Box className="flex items-center mt-2">
                    <Box className="w-full h-1 bg-gray-200 rounded-full">
                      <LinearProgress variant="determinate" value={status} />
                    </Box>
                    <Box className="ml-5 w-7 h-7 rounded-full bg-white flex items-center justify-center">
                      {status < 100 ? (
                        <Typography
                          color="primary"
                          className="text-xs"
                        >{`${status}%`}</Typography>
                      ) : status === 100 ? (
                        <DoneIcon color="primary" />
                      ) : null}
                    </Box>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </FormControl>
  );
};

export default Dropzone;
