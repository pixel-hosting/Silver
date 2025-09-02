export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    discordUsername,
    discordId,
    robloxUsername,
    brand1,
    model1,
    brand2,
    model2,
    brand3,
    model3,
  } = req.body;

  const webhookUrl = process.env.WEBHOOK_URL;

  const payload = {
    embeds: [
      {
        title: "🚗 New Drive Silverstone Registration",
        color: 0x1e90ff,
        fields: [
          { name: "Discord Username", value: discordUsername, inline: true },
          { name: "Discord ID", value: discordId, inline: true },
          { name: "Roblox Username", value: robloxUsername, inline: true },
          {
            name: "Car 1",
            value: `${brand1} — ${model1}`,
            inline: false,
          },
          {
            name: "Car 2",
            value: `${brand2} — ${model2}`,
            inline: false,
          },
          {
            name: "Car 3",
            value: `${brand3} — ${model3}`,
            inline: false,
          },
        ],
        footer: {
          text: "Drive Silverstone Form Submission",
        },
        timestamp: new Date(),
      },
    ],
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: "Failed to send webhook" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
