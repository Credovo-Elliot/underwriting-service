const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "underwriting-service",
  });
});

// Stub underwriting: takes an application snapshot and returns a decision
app.post("/underwrite", (req, res) => {
  const { application } = req.body || {};
  if (!application || !application.id) {
    return res.status(400).json({ error: "application with id is required" });
  }

  const { amount, currency } = application.data || {};
  const avm = application.avm;
  const kyc = application.kyc;

  // very fake logic:
  const maxLtv = 0.7;
  const impliedValue = avm?.estimatedValue || amount / maxLtv || 500000;
  const requestedLtv = amount && avm ? amount / avm.estimatedValue : null;

  const decision = {
    decisionId: `uw-${application.id}`,
    status: "approved", // stub: always approve
    maxLtv,
    impliedValue,
    requestedLtv,
    currency: currency || "GBP",
    kycStatus: kyc?.status || "unknown",
    avmConfidence: avm?.confidence ?? null,
    reasons: [
      "Stub underwriting decision – replace with real model later."
    ],
    createdAt: new Date().toISOString(),
  };

  res.status(200).json(decision);
});

app.listen(PORT, () => {
  console.log(`underwriting-service listening on port ${PORT}`);
});
