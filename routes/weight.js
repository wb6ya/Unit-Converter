import { Router } from "express";

const router = Router();

const convertWeight = (value, fromUnit, toUnit) => {
    const normalizedFrom = fromUnit.toLowerCase();
    const normalizedTo = toUnit.toLowerCase();
    const numericValue = Number(value);

    if (normalizedFrom === normalizedTo) {
        return numericValue;
    }

    const gramsPerUnit = {
        milligram: 0.001,
        gram: 1,
        kilogram: 1000,
        "metric ton": 1000000,
        ounce: 28.349523125,
        pound: 453.59237,
        stone: 6350.29318
    };

    if (!(normalizedFrom in gramsPerUnit)) {
        throw new Error("Invalid from unit");
    }

    if (!(normalizedTo in gramsPerUnit)) {
        throw new Error("Invalid to unit");
    }

    const gramValue = numericValue * gramsPerUnit[normalizedFrom];
    return gramValue / gramsPerUnit[normalizedTo];
};


router.post("/",(req, res) => {
    const result = convertWeight(req.body.value, req.body.from, req.body.to);
    res.render("result", { title: "Weight Conversion", result: result.toFixed(2), fromUnit: req.body.from, toUnit: req.body.to });
});

export default router;