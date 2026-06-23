import { fetchNotifications } from "./services/notificationService.js";
import { calculatePriority } from "./utils/priorityCalculator.js";
import { Log } from "./middleware/logger.js";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYW1iaGFuYWpoYW5zaWxha3NobWkuMjMuY3NtQGFuaXRzLmVkdS5pbiIsImV4cCI6MTc4MjE5ODA5NSwiaWF0IjoxNzgyMTk3MTk1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZmI3ZjRhMGUtODIzYy00NGU1LTlkMzItODk4NTI5MWQ2MTJiIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FtYmhhbmEgamhhbnNpIGxha3NobWkiLCJzdWIiOiJjOGIyYzk3NS05M2ZjLTQzNjItYmNkMi1lZDVmZmNkNTFiZmUifSwiZW1haWwiOiJzYW1iaGFuYWpoYW5zaWxha3NobWkuMjMuY3NtQGFuaXRzLmVkdS5pbiIsIm5hbWUiOiJzYW1iaGFuYSBqaGFuc2kgbGFrc2htaSIsInJvbGxObyI6ImEyMzEyNjU1MjA0OCIsImFjY2Vzc0NvZGUiOiJNVHF4YXIiLCJjbGllbnRJRCI6ImM4YjJjOTc1LTkzZmMtNDM2Mi1iY2QyLWVkNWZmY2Q1MWJmZSIsImNsaWVudFNlY3JldCI6Imh0bWVxQWJ0d2dha1hHV1oifQ.wOcxxQ7wPWT8OB3hNOuJmPs7rFXRqQNl0bPmBXsIG9c";

async function main() {
  try {
    const response = await fetchNotifications(TOKEN);

    const notifications =
      response.notifications || response.data || [];

    const ranked = notifications
      .map((item) => ({
        ...item,
        priority: calculatePriority(item)
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);

    console.table(ranked);

    await Log(
      "backend",
      "info",
      "service",
      "Generated top notifications",
      TOKEN
    );
  } catch (error) {
    console.error(error);

    await Log(
      "backend",
      "error",
      "service",
      error.message,
      TOKEN
    );
  }
}

main();