const attendanceCounts = [28, 27, 29, 26, 28, 30, 27, 29, 28, 26, 30, 27, 29, 28];
const classSize = 30;
const chart = document.querySelector("#attendance-chart");
const seriesButtons = document.querySelectorAll(".chart-tab");
const svgNamespace = "http://www.w3.org/2000/svg";
const chartLayout = { width: 900, height: 330, left: 48, right: 20, top: 16, bottom: 45 };
const chartHeight = chartLayout.height - chartLayout.top - chartLayout.bottom;
const chartWidth = chartLayout.width - chartLayout.left - chartLayout.right;
let activeSeries = "present";

function getRecentSchoolDays(count) {
  const days = [];
  const date = new Date();

  while (days.length < count) {
    const weekday = date.getDay();
    if (weekday !== 0 && weekday !== 6) {
      days.push(new Date(date));
    }
    date.setDate(date.getDate() - 1);
  }

  return days.reverse();
}

const records = getRecentSchoolDays(attendanceCounts.length).map((date, index) => ({
  date,
  present: attendanceCounts[index],
  absent: classSize - attendanceCounts[index],
}));

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(svgNamespace, tagName);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value));
  }
  return element;
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "short" }).format(date);
}

function updateSummary() {
  const presentTotal = records.reduce((sum, record) => sum + record.present, 0);
  const absentTotal = records.reduce((sum, record) => sum + record.absent, 0);
  const attendanceRate = Math.round((presentTotal / (presentTotal + absentTotal)) * 100);

  document.querySelector("#attendance-rate").textContent = `${attendanceRate}%`;
  document.querySelector("#days-count").textContent = `${records.length} วัน`;
  document.querySelector("#present-total").textContent = `${presentTotal} คน-วัน`;
  document.querySelector("#present-chart-total").textContent = presentTotal;
  document.querySelector("#absent-chart-total").textContent = absentTotal;
}

function renderChart() {
  chart.replaceChildren();

  const title = createSvgElement("title");
  title.textContent = `กราฟ${activeSeries === "present" ? "ผู้มาเรียน" : "ผู้ขาดเรียน"}รายวัน`;
  chart.append(title);

  for (let tick = 0; tick <= classSize; tick += 10) {
    const y = chartLayout.top + chartHeight - (tick / classSize) * chartHeight;
    const gridline = createSvgElement("line", {
      x1: chartLayout.left,
      x2: chartLayout.width - chartLayout.right,
      y1: y,
      y2: y,
      class: "chart-gridline",
    });
    const label = createSvgElement("text", {
      x: chartLayout.left - 12,
      y: y + 4,
      "text-anchor": "end",
      class: "chart-axis-label",
    });
    label.textContent = tick;
    chart.append(gridline, label);
  }

  const step = chartWidth / records.length;
  const barWidth = Math.min(30, step * 0.62);
  records.forEach((record, index) => {
    const value = record[activeSeries];
    const barHeight = (value / classSize) * chartHeight;
    const x = chartLayout.left + index * step + (step - barWidth) / 2;
    const y = chartLayout.top + chartHeight - barHeight;
    const bar = createSvgElement("rect", {
      x,
      y,
      width: barWidth,
      height: barHeight,
      rx: 5,
      class: `chart-bar ${activeSeries}`,
    });
    const tooltip = createSvgElement("title");
    tooltip.textContent = `${formatShortDate(record.date)}: ${value} คน`;
    bar.append(tooltip);
    chart.append(bar);

    if (index % 2 === 0 || index === records.length - 1) {
      const dateLabel = createSvgElement("text", {
        x: x + barWidth / 2,
        y: chartLayout.height - 12,
        "text-anchor": "middle",
        class: "chart-axis-label",
      });
      dateLabel.textContent = formatShortDate(record.date);
      chart.append(dateLabel);
    }
  });
}

seriesButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeSeries = button.dataset.series;
    seriesButtons.forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    renderChart();
  });
});

updateSummary();
renderChart();
