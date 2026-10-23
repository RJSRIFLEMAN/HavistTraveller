import test from "node:test";
import assert from "node:assert/strict";
import { partners, filterPartners } from "../catalog.mjs";

test("the transport partner catalog contains all supplied providers", () => {
  assert.equal(partners.length, 29);
  assert.equal(new Set(partners.map((partner) => partner.name.toLowerCase())).size, 29);
});

test("partner search is case-insensitive and searches the full provider name", () => {
  assert.deepEqual(
    filterPartners(partners, "sanjaya").map((partner) => partner.name),
    ["Bus Sanjaya trans"],
  );
  assert.equal(filterPartners(partners, "BUS").length, 9);
});

test("every partner links to its supplied Google Drive file", () => {
  assert.ok(partners.every((partner) => partner.url.startsWith("https://drive.google.com/open?id=")));
});

test("partner links preserve the supplied file IDs and order", () => {
  const suppliedIds = [
    "1z_7kiiQAx2ETgv7Tcd1xnHOj5yq__9Yx",
    "10Ea1TDlqtXODWOTdhWewCONdw5EBWPXy",
    "1RLt2dnmk_se0kA-8IST-xiCAC1oegccB",
    "1syIAJI_fIdl6eKtAJdpzRV3VWAnokknt",
    "1Jp0d-ethN2bz2KsBFoJ5bDGK_HjRXWvG",
    "1hxSiTU5rfBSO3rB3nNXdETH-aJiSIUEE",
    "1RVZQ5L8wcdjKYIBn1Qs4bKEnuNz6hLLQ",
    "1GDGruGvRbFGT68oZgloNRtMsPYzkISY6",
    "114fE3DSiAKnvy06NzIkpq0ZJcRka9xDE",
    "1iqHDq5E7OmrOelZTed70oDFuS5dZdM0w",
    "1nDnOny8HDHAdWOYDbqzEG2mGSoZvgfgo",
    "1s90pJy34pmi5k9HWkl8ezxa9SrRZs1wq",
    "1NyDW0ld5BZs9M52ihp9JeZIM6AjUS-gt",
    "1xg4SqF1-cGfYUjwqxeNbYXRwGGoZVHUb",
    "1Bn2-S2QbJkD7GTpOamYE8lIl8lBgytYg",
    "1spLwyPXPNv1gfpdb8JCktMRtSNBVGPkK",
    "1nlliBcTuxkp8lOBXGx7ZBwWkpL78Yahl",
    "1XlwM70fEokM3BkZkAhwSTvXUj8QZbeSO",
    "1_vrDPxWsSagYj0c7DAl05SHqWZIK89FF",
    "1V2JGkMn1uEOOSAhR_tPjTas_O3rn04xx",
    "1qRiCzaVqyCIJDKYtyqQB5qFUWcfcR3o2",
    "1i0DuWj0ymEul8N_1CamJVA_ZdC0nAk96",
    "11GxzHviT1JWod0jzZNpAW8279JqrwX27",
    "1Be-FzWpxUnGa8m79UV_pIZUeG6bnoKGN",
    "1WsLhy3JagaVizd4vEP1Zg8III1Q5qDDs",
    "1g3yRBPsjTy1x0qK1GeyRRjPOcHTtRJ4k",
    "1s-S1I7fSNevqiQmojVTGLleh8DUYyGea",
    "1pQiVDia2O0f-yvIzP2HOxLPftAlu0PbK",
    "1-QqkL_tBF0Vfjgjti_kLj5NZ8W4g9zF6",
  ];
  const linkedIds = partners.map((partner) => new URL(partner.url).searchParams.get("id"));
  assert.deepEqual(linkedIds, suppliedIds);
});
