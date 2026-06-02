export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const query = String(req.query.query || "St Michaels");

  try {
    const response = await fetch(
      `https://api.golfcourseapi.com/v1/search?search_query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Authorization: `Key ${process.env.GOLFCOURSE_API_KEY}`,
        },
      }
    );

    const text = await response.text();

    res.status(response.status).send(text);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "Unknown proxy error",
    });
  }
}
