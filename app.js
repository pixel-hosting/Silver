const form = document.getElementById("car-form");
const statusEl = document.getElementById("status");

// Car brand → model mapping
const carModels = {
  "McLaren": ["McLaren P1","P1 Police Model","Senna","720S","F1","Artura"],
  "Ferrari": ["1972 Ferrari Daytona Spyder 365 GTS/4","Ferrari Testarossa","Ferrari F40","Ferrari LaFerrari","Ferrari 812 Superfast","Ferrari Roma"],
  "Aston Martin": ["Aston Martin F1 Safety Car","Aston Martin Valkyrie AMR Pro Concept","Aston Martin Vulcan RDX","Aston Martin AMR21","V12 Vantage","Aston Martin Vanquish"]
};

// Populate car models based on selected brand
function populateModels(brandSelectId, modelSelectId) {
  const brandSelect = document.getElementById(brandSelectId);
  const modelSelect = document.getElementById(modelSelectId);

  // Reset models
  modelSelect.innerHTML = `<option value="">Select Model</option>`;

  const selectedBrand = brandSelect.value;
  if (selectedBrand && carModels[selectedBrand]) {
    carModels[selectedBrand].forEach(model => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  }
}

// Prevent duplicate car model selections across all 3 dropdowns
function preventDuplicates() {
  const model1 = document.getElementById("carModel1");
  const model2 = document.getElementById("carModel2");
  const model3 = document.getElementById("carModel3");

  const selectedModels = [model1.value, model2.value, model3.value];

  [model1, model2, model3].forEach(currentSelect => {
    Array.from(currentSelect.options).forEach(option => {
      if (
        option.value &&
        selectedModels.includes(option.value) &&
        option.value !== currentSelect.value
      ) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    });
  });
}

// Attach listeners for brand selection
["carBrand1", "carBrand2", "carBrand3"].forEach((brandId, index) => {
  document.getElementById(brandId).addEventListener("change", () => {
    populateModels(brandId, `carModel${index + 1}`);
    preventDuplicates();
  });
});

// Attach listeners for model selection
["carModel1", "carModel2", "carModel3"].forEach(modelId => {
  document.getElementById(modelId).addEventListener("change", preventDuplicates);
});

// Handle form submission securely via Vercel API route
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Submitting...";
  statusEl.style.color = "#60a5fa"; // blue while submitting

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      statusEl.style.color = "#4ade80"; // green success
      statusEl.textContent = "Submission successful!";
      form.reset();
    } else {
      statusEl.style.color = "#f87171"; // red error
      statusEl.textContent = "Submission failed. Try again.";
    }
  } catch (err) {
    statusEl.style.color = "#f87171";
    statusEl.textContent = "Error connecting to server.";
  }
});
