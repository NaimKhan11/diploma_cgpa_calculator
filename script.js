// script.js
const regulationWeights = {
  "2010": [5,5,5,15,15,20,25,10],
  "2016": [5,5,5,10,15,20,25,15],
  "2022": [5,5,10,10,20,20,20,10]
};

const probidhanSelect = document.getElementById('probidhan');
const weightEls = [...Array(8)].map((_,i)=>document.getElementById('w'+(i+1)));
const calcBtn = document.getElementById('calcBtn');
const resetBtn = document.getElementById('resetBtn');
const resultDiv = document.getElementById('result');
const cgpaText = document.getElementById('cgpaText');
const detailsText = document.getElementById('detailsText');

function updateWeightsDisplay(){
  const key = probidhanSelect.value;
  const weights = regulationWeights[key];
  weightEls.forEach((el, idx) => {
    el.textContent = `(${weights[idx]}%)`;
  });
  document.getElementById('weights-note').textContent = `Selected: Regulation ${key} — weights updated.`;
  resultDiv.hidden = true;
}

function parseGPA(id){
  const el = document.getElementById(id);
  const v = el.value.trim();
  if(v === "") return null;
  const num = Number(v);
  if(Number.isNaN(num)) return null;
  return num;
}

function validateGPAs(gpas){
  for(let i=0;i<gpas.length;i++){
    const v = gpas[i];
    if(v === null) continue;
    if(v < 0 || v > 4){
      return { ok:false, msg:`Semester ${i+1} GPA must be between 0.00 and 4.00` };
    }
  }
  return { ok:true };
}

function calculateCGPA(){
  const weights = regulationWeights[probidhanSelect.value];
  const gpas = [];
  for(let i=1;i<=8;i++){
    gpas.push(parseGPA('s'+i));
  }

  const v = validateGPAs(gpas);
  if(!v.ok){
    alert(v.msg);
    return;
  }

  let usedEmpty = false;
  let weightedSum = 0;
  let totalWeight = 0;
  for(let i=0;i<8;i++){
    const g = (gpas[i] === null) ? 0 : gpas[i];
    if(gpas[i] === null) usedEmpty = true;
    const w = weights[i];
    weightedSum += g * w;
    totalWeight += w;
  }

  // Final CGPA two decimal places
  const cgpa = (weightedSum / totalWeight).toFixed(2);

  resultDiv.hidden = false;
  cgpaText.innerHTML = `<strong>CGPA:</strong> ${cgpa} (Regulation ${probidhanSelect.value})`;
  detailsText.innerHTML = usedEmpty
    ? `Some semesters were left blank — those were counted as 0.00.`
    : `All semesters were included with correct weights.`;
}

probidhanSelect.addEventListener('change', updateWeightsDisplay);
calcBtn.addEventListener('click', calculateCGPA);
resetBtn.addEventListener('click', ()=>{
  document.getElementById('gpa-form').reset();
  updateWeightsDisplay();
  resultDiv.hidden = true;
});

// Default: Regulation 2022
probidhanSelect.value = "2022";
updateWeightsDisplay();
