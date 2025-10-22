import express from "express";
import cors from "cors";
import { generateChartScreenshot } from "./chart-screenshot.js";

const app = express();
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
  res.send("✅ Chart server is alive!");
});


app.post("/generate-chart", async (req, res) => {
  try {
    const { schoolId, leerlingId, schooljaar, periode } = req.body;

    const imageBase64 = await generateChartScreenshot({
      school: schoolId,
      leerlingId,
      schooljaar,
      periode
    });

    res.json({ success: true, imageBase64 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(8080, '0.0.0.0', () => console.log("Chart server running on port 8080"));
