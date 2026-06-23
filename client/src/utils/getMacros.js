export function getMacros(calories, goal, weightKg) {
  const splits = {
    cut:      { protein: 0.40, carbs: 0.35, fat: 0.25 },
    maintain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
    bulk:     { protein: 0.25, carbs: 0.50, fat: 0.25 },
  };
  const split = splits[goal];
  const proteinFromPct = Math.round((calories * split.protein) / 4);
  const proteinFloor   = Math.round(weightKg * 1.6);
  return {
    protein: Math.max(proteinFromPct, proteinFloor),
    carbs:   Math.round((calories * split.carbs) / 4),
    fat:     Math.round((calories * split.fat)   / 9),
  };
}