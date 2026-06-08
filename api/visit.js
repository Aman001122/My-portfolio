export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ status: "ready" });
  }

  try {
    const {
      session_id,
      page_url,
      browser,
      os,
      device,
      screen_resolution,
      referrer,
      event_type,
      devtools_detected
    } = req.body;

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket?.remoteAddress ||
      null;

    const visitor = {
      session_id,
      page_url,
      browser,
      os,
      device,
      screen_resolution,
      referrer,
      ip,
      devtools_detected: !!devtools_detected,
      suspicion_level: devtools_detected ? "LOW" : null
    };

    return res.status(200).json({
      status: "received",
      visitor,
      event_type
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}