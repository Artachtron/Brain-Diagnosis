import { Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import React from "react";

const FileProgressBar = ({ value, fileCount }) => {
  const segmentWidth = 100 / fileCount;

  return (
    <Box className="relative flex items-center">
      {Array.from({ length: fileCount }, (_, i) => (
        <React.Fragment key={i}>
          <Box
            className="h-1"
            bgcolor={value > i * segmentWidth ? "primary.main" : "grey.300"}
            style={{ flex: 1 }}
          />
          <Box className="mx-2">
            {value > i * segmentWidth ? (
              <CheckCircleIcon color="primary" />
            ) : (
              <PendingIcon color="primary" />
            )}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default FileProgressBar;
