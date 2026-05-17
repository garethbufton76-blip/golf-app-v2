export async function searchCourses(query: string) {
  const response = await fetch(
    `/api/golf-search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("GolfCourseAPI proxy error:", text);
    throw new Error(text);
  }

  return response.json();
}
