const API =
"https://script.google.com/macros/s/AKfycbw3h4ZkxAcvB_ox6_3OvW9iNTgFtAsuXqyaEsCBckK5_1yGHGGU3_9v8-P4M7D_wTDrlQ/exec";

let allData = [];

async function loadDashboardData() {
  let rawData = null;
  // 1. Try offline-first local data bundle
  try {
    const localRes = await fetch("data/election_data.json");
    if (localRes.ok) {
      rawData = await localRes.json();
      console.info("Loaded election data from local offline bundle.");
    }
  } catch (err) {
    console.warn("Local data fetch fallback to live Google Apps Script:", err);
  }

  // 2. Fallback to live Google Apps Script endpoint if local data is unavailable
  if (!rawData) {
    const res = await fetch(API);
    rawData = await res.json();
  }

  const items = Array.isArray(rawData) ? rawData : (rawData.assembly || []);
  allData = items;

  const zones = [...new Set(items.map(x => x.zone))];
  const zoneSelect = document.getElementById("zone");
  zoneSelect.innerHTML = '<option value="">Select Zone</option>';
  zones.forEach(z => {
    zoneSelect.innerHTML += `<option value="${z}">${z}</option>`;
  });
}

loadDashboardData();

document.getElementById("zone")
.addEventListener("change", function () {

  const zone = this.value;

  const lsData =
    allData.filter(x => x.zone === zone);

  const ls =
    [...new Set(lsData.map(x => x.loksabha))];

  const lsSelect =
    document.getElementById("ls");

  lsSelect.innerHTML =
    '<option value="">Select Lok Sabha</option>';

  ls.forEach(item => {
    lsSelect.innerHTML +=
      `<option value="${item}">${item}</option>`;
  });
});

document.getElementById("ls")
.addEventListener("change", function () {

  const zone =
    document.getElementById("zone").value;

  const ls = this.value;

  const asm =
    allData.filter(
      x => x.zone === zone &&
      x.loksabha === ls
    );

  const assemblys =
    [...new Set(asm.map(x => x.assembly))];

  const assemblySelect =
    document.getElementById("assembly");

  assemblySelect.innerHTML =
    '<option value="">Select Assembly</option>';

  assemblys.forEach(item => {
    assemblySelect.innerHTML +=
      `<option value="${item}">${item}</option>`;
  });
});

document.getElementById("assembly")
.addEventListener("change", function () {

  const zone =
    document.getElementById("zone").value;

  const ls =
    document.getElementById("ls").value;

  const assembly =
    this.value;

  const row =
    allData.find(
      x => x.zone === zone &&
      x.loksabha === ls &&
      x.assembly === assembly
    );

  document.getElementById("result")
    .innerHTML = row ? row.details : "";
});