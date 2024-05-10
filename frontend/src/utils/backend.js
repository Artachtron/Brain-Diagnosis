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
