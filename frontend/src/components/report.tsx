"use client";
import { CardMedia, Typography } from "@mui/material";

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
  console.log(output.length);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Diagnosis Report for <span className="text-purple-800">{disease}</span>
      </h1>
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
  );
};

export default Report;
