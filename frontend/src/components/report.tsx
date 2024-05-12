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
import { formData } from "./form/diagnosis";
import { useState, useEffect } from "react";

const colorMap: Record<number, string> = {
  0: "#013a63",
  1: "#01497c",
  2: "#2a6f97",
  10: "#468faf",
};

type diagnosis = {
  filename: string;
  label: string;
  confidence: number;
  gravity: number;
  classes: string[];
};

interface ReportProps {
  input: formData;
  output: diagnosis[];
  progress: number;
}

const formatConfidence = (confidence: number) => {
  return (confidence * 100).toFixed(2) + "%";
};

const Report: React.FC<ReportProps> = ({ input, output, progress }) => {
  const disease = input.disease;
  const [labels, setLabels] = useState<Record<string, number>>({});
  const classes = output[0].classes;

  useEffect(() => {
    const labelCounts = output.reduce<Record<string, number>>((acc, item) => {
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
  }, [output, classes]);

  console.log(labels);

  return (
    <div
      className="border-2 border-purple-700 rounded-xl p-5 mb-2"
      style={{ backgroundColor: "#ebc9ff" }}
    >
      <h1 className="text-3xl mb-4 text-center">
        Diagnosis Report for{" "}
        <Typography
          className="text-3xl font-bold text-purple-800"
          component="span"
        >
          {disease}
        </Typography>
      </h1>
      <div className="grid grid-cols-3 gap-0">
        {output.map((item, index) => {
          if (index >= progress) return null;
          const file = input.files?.find((file) => file.name === item.filename);
          const colorClass = colorMap[item.gravity] || "text-black";
          return (
            <div key={index} className="flex items-center mb-4">
              <div className="flex flex-col items-center mr-4">
                <Typography
                  style={{ fontSize: "10px" }}
                  className="text-center"
                >
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
                <Typography
                  className={`text-xl font-bold`}
                  style={{ color: colorClass }}
                >
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
            <TableHead className="bg-purple-800 text-white">
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
