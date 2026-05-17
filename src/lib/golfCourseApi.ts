const API_KEY = "YOUR_API_KEY";

const BASE_URL = "https://api.golfcourseapi.com/v1";

export async function searchCourses(query: string) {
  const response = await fetch(
    `${BASE_URL}/search?search_query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Key ${API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search courses");
  }

  return response.json();
}

export async function getCourse(courseId: number) {
  const response = await fetch(
    `${BASE_URL}/courses/${courseId}`,
    {
      headers: {
        Authorization: `Key ${API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }

  return response.json();
}
