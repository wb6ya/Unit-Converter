import { Router } from "express";

const router = Router();

const convertLength = (value, fromUnit, toUnit) => {
  const normalizedFrom = fromUnit.toLowerCase();
  const normalizedTo = toUnit.toLowerCase();
  const numericValue = Number(value);

  if (normalizedFrom === normalizedTo) {
    return numericValue;
  }

  const metersPerUnit = {
    millimeter: 0.001,
    centimeter: 0.01,
    meter: 1,
    kilometer: 1000,
    inch: 0.0254,
    foot: 0.3048,
    yard: 0.9144,
    mile: 1609.344
  };

  if (!(normalizedFrom in metersPerUnit)) {
    throw new Error("Invalid from unit");
  }

  if (!(normalizedTo in metersPerUnit)) {
    throw new Error("Invalid to unit");
  }

  const meterValue = numericValue * metersPerUnit[normalizedFrom];
  return meterValue / metersPerUnit[normalizedTo];
};

router.post("/",(req, res) => {
    const result = convertLength(req.body.value, req.body.from, req.body.to);
    res.render("result", { title: "Length Conversion", result: result.toFixed(2), fromUnit: req.body.from, toUnit: req.body.to });
});

export default router;