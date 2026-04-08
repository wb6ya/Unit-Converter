import { Router } from "express";

const router = Router();

const convertTemperature = (value, fromUnit, toUnit) => {
  const normalizedFrom = fromUnit.toLowerCase();
  const normalizedTo = toUnit.toLowerCase();
  const numericValue = Number(value);

  if (normalizedFrom === normalizedTo) {
    return numericValue;
  }
  
  let celsiusValue;
  switch (normalizedFrom) {
    case 'celsius':
      celsiusValue = numericValue;
      break;
    case 'fahrenheit':
      celsiusValue = (numericValue - 32) * 5 / 9;
      break;
    case 'kelvin':
      celsiusValue = numericValue - 273.15;
      break;
    case 'rankine':
      celsiusValue = (numericValue - 491.67) * 5 / 9;
      break;
    default:
      throw new Error('Invalid from unit');
  }

  switch (normalizedTo) {
    case 'celsius':
      return celsiusValue;
    case 'fahrenheit':
      return (celsiusValue * 9 / 5) + 32;
    case 'kelvin':
        return celsiusValue + 273.15;
      case 'rankine':
        return (celsiusValue + 273.15) * 9 / 5;
      default:
        throw new Error('Invalid to unit');
  }
};

/* GET home page. */
router.post("/",(req, res) => {
    const result = convertTemperature(req.body.value, req.body.from, req.body.to);
    res.render("result", { title: "Temperature Conversion", result: result.toFixed(2), fromUnit: req.body.from, toUnit: req.body.to });
});

export default router;