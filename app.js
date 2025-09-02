const cars = {
  "McLaren": ["McLaren P1","P1 Police Model","Senna","720S","F1","Artura"],
  "Ferrari": ["1972 Ferrari Daytona Spyder 365 GTS/4","Ferrari Testarossa","Ferrari F40","Ferrari LaFerrari","Ferrari 812 Superfast","Ferrari Roma"],
  "Aston Martin": ["Aston Martin F1 Safety Car","Aston Martin Valkyrie AMR Pro Concept","Aston Martin Vulcan RDX","Aston Martin AMR21","V12 Vantage","Aston Martin Vanquish"]
};

const brandEls = [document.getElementById("brand1"), document.getElementById("brand2"), document.getElementById("brand3")];
const modelEls = [document.getElementById("model1"), document.getElementById("model2"), document.getElementById("model3")];
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

function populateBrands() {
  const brands = Object.keys(cars);
  brandEls.forEach((brandEl, idx) => {
    brandEl.innerHTML = brands.map(b => `<option value="${b}">${b}</option>`).join("");
    populateModels(idx);
  });
}

function populateModels(index) {
  const brand = brandEls[index].value;
  const modelEl = modelEls[index];
  modelEl.innerHTML = cars[brand].map(m => `<option value="${m}">${m}</option>`).join("");
  ensureUniqueModels();
}

function ensureUniqueModels() {
  const selected = modelEls.map(m => m.value);
  const duplicates = new Set(selected.filter((m, i, arr) => arr.indexOf(m) !== i));

  modelEls.forEach(modelEl => {
    Array.from(modelEl.options).forEach(opt => {
      opt.disabled = selected.includes(opt.value) && opt.value !== modelEl.value;
    });
  });

  if (duplicates.size > 0) {
    statusEl.textContent = "You can't pick the same car model twice.";
  } else {
    statusEl.textContent = "";
  }
}

brandEls.forEach((brandEl, idx) => {
  brandEl.addEventListener("change", () => populateModels(idx));
});

modelEls.forEach(modelEl => {
  modelEl.addEventListener("change", ensureUniqueModels);
});

populateBrands();
ensureUniqueModels();

document.getElementById("carForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const discordUsername = document.getElementById("discordUsername").value.trim();
  const discordId = document.getElementById("discordId").value.trim();
  const robloxUsername = document.getElementById("robloxUsername").value.trim();
  const picks = [0,1,2].map(i => ({ brand: brandEls[i].value, model: modelEls[i].value }));

  const uniqueModels = new Set(picks.map(p => p.model));
  if (uniqueModels.size !== picks.length) {
    statusEl.textContent = "Duplicate car models selected.";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const res = await fetch(process.env.DISCORD_WEBHOOK_URL || "/api/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `**Drive Silverstone Submission**\nDiscord Username: ${discordUsername}\nDiscord ID: ${discordId}\nRoblox Username: ${robloxUsername}\nCar Picks:\n1. ${picks[0].brand} — ${picks[0].model}\n2. ${picks[1].brand} — ${picks[1].model}\n3. ${picks[2].brand} — ${picks[2].model}`
      })
    });

    if (!res.ok) throw new Error("Webhook failed");
    statusEl.style.color = "#66ff66";
    statusEl.textContent = "Submitted successfully.";
    document.getElementById("carForm").reset();
    populateBrands();
    ensureUniqueModels();
  } catch (err) {
    statusEl.style.color = "#ff6666";
    statusEl.textContent = "Submission failed.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});
