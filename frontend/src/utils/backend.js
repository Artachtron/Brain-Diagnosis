const BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";

let endpoints = null;

const getEndpoints = () => {
  if (endpoints) {
    return endpoints;
  }

  return fetch(`${BASE_URL}/routes`)
    .then((response) => response.json())
    .then((data) => {
      endpoints = data;
      return data;
    })
    .catch((error) => console.error("Error:", error));
};

export const getEndpoint = async (endpoint, params) => {
  const endpoints = await getEndpoints();

  if (!params) {
    console.log("endpoint:", `${BASE_URL}${endpoints[endpoint]}`);
    return `${BASE_URL}${endpoints[endpoint]}`;
  }

  const endpointUrl = endpoints[endpoint] || "";

  // Replace dynamic path parameters in the endpoint URL
  const dynamicPathRegex = /{(\w+)}/g;
  const urlWithParams = endpointUrl.replace(
    dynamicPathRegex,
    (_, paramName) => params[paramName]
  );
  console.log(urlWithParams);
  console.log("endpoint:", `${BASE_URL}${urlWithParams}`);

  // Append query parameters to the URL
  return `${BASE_URL}${urlWithParams}`;
};

export const getApiUrl = async (endpoint, params) => {
  const endpoints = await getEndpoints();

  if (!params) {
    return `${BASE_URL}${endpoints[endpoint]}`;
  }

  const endpointUrl = endpoints[endpoint] || "";

  // Replace dynamic path parameters in the endpoint URL
  const dynamicPathRegex = /{(\w+)}/g;
  const urlWithParams = endpointUrl.replace(
    dynamicPathRegex,
    (_, paramName) => params[paramName]
  );

  // Append query parameters to the URL
  return `${BASE_URL}${urlWithParams}`;
};

export const sendFormData = async (endpoint, formData) => {
  const url = await getEndpoint(endpoint);
  return fetch(url, {
    method: "POST",
    body: formData,
  });
};

export const backendRequest = async (
  endpoint,
  params = {},
  method = "GET",
  body
) => {
  console.log(
    "endpoint:",
    endpoint,
    "params:",
    params,
    "method:",
    method,
    "body:",
    body
  );
  // console.log("token:", localStorage.getItem("token"));
  const url = await getEndpoint(endpoint, params);
  return fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      // Authorization: "Bearer " + localStorage.getItem("token") || "",
    },
    body: JSON.stringify(body),
    // credentials: "include",
  });
};

export function streamingResponse(response, setData) {
  let data = "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return new Promise((resolve, reject) => {
    reader.read().then(function process({ done, value }) {
      if (done) {
        resolve(data);
        return;
      }
      data += decoder.decode(value);
      if (setData) {
        setData((prevData) => prevData + data);
      }
      reader.read().then(process).catch(reject);
    });
  });
}

export function uploadFileWithProgress(endpoint, file, data = {}, onProgress) {
  return new Promise(async (resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    for (const key in data) {
      formData.append(key, data[key]);
    }
    const url = await getEndpoint(endpoint);
    xhr.open("POST", url);
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        onProgress(percentCompleted);
      }
    });

    xhr.onload = () => {
      if (xhr.status !== 200) {
        reject("File upload failed");
      } else {
        resolve(xhr.response);
      }
    };

    xhr.onerror = () => {
      reject("Network error");
    };

    xhr.send(formData);
  });
}
