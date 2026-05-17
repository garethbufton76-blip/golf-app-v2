const API_KEY = "SXUKS5HIJ7M23LY246DWQ44XWQ";

const API_HOST = "golf-course-api.p.rapidapi.com";

export async function searchCourses(query: string) {
  const response = await fetch(
    `https://${API_HOST}/search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": API_HOST,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();

    console.error("GolfCourseAPI Error:", text);

    throw new Error(text);
  }

  return response.json();
}
