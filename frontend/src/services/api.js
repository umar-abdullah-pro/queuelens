const API_URL = import.meta.env.VITE_API_URL;

export const api = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";

  let data = null;

  if (contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();

    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};
