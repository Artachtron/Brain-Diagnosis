"use client";
import React, { useCallback, useState, useEffect } from "react";
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

  const [progress, setProgress] = useState(0);
  const [statuses, setStatuses] = useState([0]);
  const [uploadStatus, setUploadStatus] = useState("select");
  const filesToProcess =
    acceptedFiles.length > 0
      ? multiple
        ? acceptedFiles
        : [acceptedFiles[0]]
      : [];

  useEffect(() => {
    if (analyzed === 0) {
      setStatuses([0]);
      return;
    }

    let uploadedStatus = 50;
    let completedStatus = 100;

    setStatuses(() =>
      Array.from({ length: analyzed + 1 }, (_, index) => {
        if (index === analyzed) {
          return uploadedStatus;
        } else if (index < analyzed) {
          return completedStatus;
        } else {
          return 0; // default value for non-existing indices
        }
      })
    );
  }, [analyzed]);

  useEffect(() => {
    console.log(statuses);
  }, [statuses]);

  /* useEffect(() => {
    const handleFileUpload = async () => {
      for (const file of filesToProcess) {
        try {
          const response = await uploadFileWithProgress(
            "diagnose_one",
            file,
            setProgress
          );
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (filesToProcess.length > 0) {
      handleFileUpload();
    }
  }, [filesToProcess]); */

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
                      {status < 50 ? (
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
