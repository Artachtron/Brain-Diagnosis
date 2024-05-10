"use client";

import { useEffect, useState } from "react";
import {
  backendRequest,
  getEndpoint,
  streamingResponse,
} from "@/utils/backend";
import { Typography } from "@mui/material";

export default function Test() {
  const [data, setData] = useState("");

  useEffect(() => {
    /* backendRequest("stream")
      .then(streamingResponse)
      .then((data) => {
        setData(data);
      })
      .catch(console.error); */

    backendRequest("stream")
      .then((response) => streamingResponse(response, setData))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Test Page</h1>
      <Typography variant="body1">{data}</Typography>
    </div>
  );
}
