const predictionButton = document.querySelector("#calculate-prediction");
const confidenceValue = document.querySelector("#prediction-confidence");
const trendValue = document.querySelector("#prediction-trend");
const recommendationValue = document.querySelector("#prediction-recommendation");
const predictionStatus = document.querySelector("#prediction-status");
const predictionLabel = document.querySelector("#prediction-label");

function updatePrediction() {
  const summary = window.mathApp.getScoreSummary();
  if (!summary.completed) {
    confidenceValue.textContent = "—";
    trendValue.textContent = "—";
    recommendationValue.textContent = "—";
    predictionLabel.textContent = "ยังไม่มีข้อมูล";
    predictionStatus.textContent = "ทำแบบฝึกหัดอย่างน้อยหนึ่งชุดเพื่อดูแนวโน้มจากคะแนนที่บันทึกไว้";
    return;
  }

  confidenceValue.textContent = `${summary.average}%`;
  trendValue.textContent =
    summary.average >= 80 ? "ดี" : summary.average >= 60 ? "กำลังพัฒนา" : "ควรทบทวน";
  recommendationValue.textContent =
    summary.average >= 80
      ? "ฝึกระดับสูง"
      : summary.average >= 60
        ? "ฝึกระดับปานกลาง"
        : "ทบทวนบทเรียน";
  predictionLabel.textContent = "ประมาณการจากคะแนน";
  predictionStatus.textContent = `คำนวณจากแบบฝึกหัดที่ทำแล้ว ${summary.completed} ชุด · ไม่ใช่การทำนายด้วย AI`;
}

predictionButton.addEventListener("click", updatePrediction);
if (window.mathApp.getScoreSummary().completed) updatePrediction();
