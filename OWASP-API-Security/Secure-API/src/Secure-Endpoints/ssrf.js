const ALLOWED_DOMAINS = ['images.mysite.com', 'storage.googleapis.com'];

export default function checkAllowedDomain(req, res, next) {
  try {
    const userUrl = new URL(req.query.url);

    if (!ALLOWED_DOMAINS.includes(userUrl.hostname)) {
      return res.status(403).send("Forbidden domain!");
    }

    req.userUrl = userUrl; // pass to route
    next();
  } catch {
    res.status(400).send("Invalid URL");
  }
}
