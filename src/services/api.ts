const BASE_URL = "https://687319aac75558e273535336.mockapi.io/api";

export const fetchCourses = async () => {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};
