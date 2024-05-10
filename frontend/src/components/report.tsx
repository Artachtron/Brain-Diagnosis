"use client";
import { CardMedia } from "@mui/material";

const colorMap = {
  0: "text-green-500",
  1: "text-yellow-500",
  2: "text-orange-500",
  10: "text-red-500",
};

const formatConfidence = (confidence) => {
  return (confidence * 100).toFixed(2) + "%";
};

const Report = ({ input, output }) => {
  const disease = input.disease;
  console.log(input);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        Diagnosis Report for <span className="text-purple-800">{disease}</span>
      </h1>
      {output.map((item, index) => {
        const file = input.files.find((file) => file.name === item.filename);
        const colorClass = colorMap[item.gravity] || "text-black";
        return (
          <div key={index} className="flex items-center mb-4">
            {file && (
              <CardMedia
                component="img"
                alt={file.name}
                image={URL.createObjectURL(file)}
                className="w-24 h-24 object-cover mr-4"
              />
            )}
            <div>
              <p className={`${colorClass} text-2xl`}>{item.label}</p>
              <p>Confidence: {formatConfidence(item.confidence)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Report;
