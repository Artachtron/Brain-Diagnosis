"use client";
import {
  CardMedia,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

const colorMap = {
  0: "text-green-500",
  1: "text-yellow-500",
  2: "text-orange-500",
  10: "text-red-500",
};

const formatConfidence = (confidence) => {
  return (confidence * 100).toFixed(2) + "%";
};

const Report = ({ input, output, progress }) => {
  const disease = input.disease;
  const [labels, setLabels] = useState([]);
  const classes = output[0].classes;

  useEffect(() => {
    // if (input.files.length === output.length) {
    const labelCounts = output.reduce((acc, item) => {
      acc[item.label] = (acc[item.label] || 0) + 1;
      return acc;
    }, {});

    classes.forEach((label) => {
      if (!labelCounts[label]) {
        labelCounts[label] = 0;
      }
    });

    setLabels(labelCounts);
    // }
  }, [output]);

  console.log(labels);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Diagnosis Report for <span className="text-purple-800">{disease}</span>
      </h1>
      <div className="grid grid-cols-3 gap-0">
        {output.map((item, index) => {
          if (index >= progress) return null;
          const file = input.files.find((file) => file.name === item.filename);
          const colorClass = colorMap[item.gravity] || "text-black";
          return (
            <div key={index} className="flex items-center mb-4">
              <div className="flex flex-col items-center mr-4">
                <Typography style={{ fontSize: "8px" }} className="text-center">
                  {item.filename}
                </Typography>
                {file && (
                  <CardMedia
                    component="img"
                    alt={file.name}
                    image={URL.createObjectURL(file)}
                    className="w-24 h-24 object-cover mt-2"
                  />
                )}
              </div>
              <div>
                <Typography className={`${colorClass} text-2xl`}>
                  {item.label}
                </Typography>
                <Typography>
                  Confidence: {formatConfidence(item.confidence)}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
      {labels && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-purple-800">
              <TableRow>
                <TableCell className="text-white">Label</TableCell>
                <TableCell className="text-white" align="right">
                  Count
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((label, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {label}
                  </TableCell>
                  <TableCell align="right">{labels[label] || 0}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Report;
