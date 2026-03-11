import axios from 'axios';
import DOMPurify from 'isomorphic-dompurify'; // Cleans HTML

export const sanitizeExternalWeatherData = async (req, res, next) => {
  try {
    const result = await axios.get('https://third-party-weather-api.com/data');

    // Save only sanitized third-party content for downstream handlers.
    const safeDescription = DOMPurify.sanitize(result.data.description || '');
    res.locals.weather = { description: safeDescription };

    next();
  } catch (error) {
    next(error);
  }
};