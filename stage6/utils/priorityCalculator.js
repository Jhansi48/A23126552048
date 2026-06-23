export const calculatePriority = (notification) => {
  const weights = {
    Placement: 3,
    Result: 2,
    Event: 1
  };

  const typeScore = weights[notification.Type] || 0;

  const ageHours =
    (Date.now() -
      new Date(notification.Timestamp).getTime()) /
    (1000 * 60 * 60);

  const recencyScore = Math.max(0, 100 - ageHours);

  return typeScore * 100 + recencyScore;
};