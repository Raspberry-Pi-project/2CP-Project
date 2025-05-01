import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {

  const chartInstance = Chart.instances[0]

  if (chartInstance) {
  
    chartInstance.options = {
      ...chartInstance.options,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: "rgba(44, 34, 101, 0.64)",
            borderColor: "rgba(89, 73, 183, 0.73)",
          },
          ticks: {
            callback: (value) => value + "%",
            color: "#7b68ee",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
        x: {
          grid: {
            color: "rgba(123, 104, 238, 0.1)",
            borderColor: "rgba(123, 104, 238, 0.2)",
          },
          ticks: {
            color: "#7b68ee",
            font: {
              size: 12,
              weight: "bold",
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(123, 104, 238, 0.9)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "rgba(47, 199, 161, 0.5)",
          borderWidth: 2,
          padding: 12,
          displayColors: false,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 14,
          },
          callbacks: {
            label: (context) => `Success Rate: ${context.raw}%`,
          },
        },
      },
      animation: {
        duration: 2000,
        easing: "easeOutQuart",
      },
    }

    chartInstance.data.datasets[0] = {
      ...chartInstance.data.datasets[0],
      backgroundColor: (context) => {
        const chart = context.chart
        const { ctx, chartArea } = chart

        if (!chartArea) {
          return "rgba(47, 199, 161, 0.7)"
        }


        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
        gradient.addColorStop(0, "rgba(123, 104, 238, 0.7)")
        gradient.addColorStop(1, "rgba(47, 199, 161, 0.7)")

        return gradient
      },
      borderColor: "rgba(123, 104, 238, 0)",
      borderWidth: 0,
      borderRadius: 8,
      hoverBackgroundColor: "rgba(47, 199, 161, 0.8)",
    }

    chartInstance.update()
  }
})
