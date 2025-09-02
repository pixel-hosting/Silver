export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: "Webhook not configured" });
  }

  const data = req.body;

  const embed = {
    title: "🚗 New Drive Silverstone Registration",
    color: 3092790,
    fields: [
      { name: "Discord Username", value: data.discordUsername || "N/A", inline: true },
      { name: "Discord ID", value: data.discordId || "N/A", inline: true },
      { name: "Roblox Username", value: data.robloxUsername || "N/A", inline: false },
      { name: "Car 1", value: `${data.carBrand1} - ${data.carModel1}`, inline: false },
      { name: "Car 2", value: `${data.carBrand2} - ${data.carModel2}`, inline: false },
      { name: "Car 3", value: `${data.carBrand3} - ${data.carModel3}`, inline: false },
    ],
    footer: {
      text: "Drive Silverstone Form Submission",
    },
    timestamp: new Date(),
  };

  try {
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      return res.status(500).json({ error: "Discord webhook failed", details: errText });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
