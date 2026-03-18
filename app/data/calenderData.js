// ✅ calenderData.js
export const calenderData = (() => {
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const arr = [];
  const startDate = new Date("2025-01-01");
  const endDate = new Date("2025-12-31");

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];

    arr.push({
      date: dateStr,
      opened: randomInt(5, 15),
      closed: randomInt(4, 12),
      sent: randomInt(10, 30),
      delivered: randomInt(8, 25),
      read: randomInt(5, 20),
      failed: randomInt(0, 5),
      avgTime: randomInt(20, 600),
      avgResponse: randomInt(0, 15),
    });
  }

  return arr;
})();
