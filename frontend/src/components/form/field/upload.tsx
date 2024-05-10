"use client";
import React, { useCallback, useState } from "react";
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

interface DropzoneProps {
  label: string;
  files: string[];
  setFiles: React.Dispatch<React.SetStateAction<string[]>>;
  multiple?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({
  label,
  files = [],
  setFiles,
  multiple = true,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(acceptedFiles);
    },
    [setFiles]
  );

  /* let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);
          setUploadStatus("done");
        }
      }, 100);
    },
*/

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const filesToProcess =
    acceptedFiles.length > 0
      ? multiple
        ? acceptedFiles
        : [acceptedFiles[0]]
      : [];

  files.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

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
          {filesToProcess.map((file, index) => (
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
                    <LinearProgress variant="determinate" value={progress} />
                  </Box>
                  <Box className="ml-5 w-7 h-7 rounded-full bg-white flex items-center justify-center">
                    {uploadStatus === "uploading" ? (
                      <Typography
                        color="primary"
                        className="text-xs"
                      >{`${progress}%`}</Typography>
                    ) : uploadStatus === "done" ? (
                      <DoneIcon color="primary" />
                    ) : null}
                  </Box>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </FormControl>
  );
};

export default Dropzone;
