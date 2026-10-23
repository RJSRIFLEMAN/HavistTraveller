export const partners = [
  { name: "white horse", id: "1z_7kiiQAx2ETgv7Tcd1xnHOj5yq__9Yx" },
  { name: "Aka wisata", id: "10Ea1TDlqtXODWOTdhWewCONdw5EBWPXy" },
  { name: "trans santree", id: "1RLt2dnmk_se0kA-8IST-xiCAC1oegccB" },
  { name: "Trac", id: "1syIAJI_fIdl6eKtAJdpzRV3VWAnokknt" },
  { name: "Subur jaya", id: "1Jp0d-ethN2bz2KsBFoJ5bDGK_HjRXWvG" },
  { name: "SS Travellink", id: "1hxSiTU5rfBSO3rB3nNXdETH-aJiSIUEE" },
  { name: "Sjm trans", id: "1RVZQ5L8wcdjKYIBn1Qs4bKEnuNz6hLLQ" },
  { name: "rmf trans", id: "1GDGruGvRbFGT68oZgloNRtMsPYzkISY6" },
  { name: "relisa", id: "114fE3DSiAKnvy06NzIkpq0ZJcRka9xDE" },
  { name: "Pristige3", id: "1iqHDq5E7OmrOelZTed70oDFuS5dZdM0w" },
  { name: "Phd trans", id: "1nDnOny8HDHAdWOYDbqzEG2mGSoZvgfgo" },
  { name: "Msm Asyrof", id: "1s90pJy34pmi5k9HWkl8ezxa9SrRZs1wq" },
  { name: "mana suka", id: "1NyDW0ld5BZs9M52ihp9JeZIM6AjUS-gt" },
  { name: "Malika wisata", id: "1xg4SqF1-cGfYUjwqxeNbYXRwGGoZVHUb" },
  { name: "Langkisau wisata", id: "1Bn2-S2QbJkD7GTpOamYE8lIl8lBgytYg" },
  { name: "jempol Trans", id: "1spLwyPXPNv1gfpdb8JCktMRtSNBVGPkK" },
  { name: "Jangule trans", id: "1nlliBcTuxkp8lOBXGx7ZBwWkpL78Yahl" },
  { name: "citra kencana", id: "1XlwM70fEokM3BkZkAhwSTvXUj8QZbeSO" },
  { name: "Bus William", id: "1_vrDPxWsSagYj0c7DAl05SHqWZIK89FF" },
  { name: "Bus U trans", id: "1V2JGkMn1uEOOSAhR_tPjTas_O3rn04xx" },
  { name: "Bus TAM", id: "1qRiCzaVqyCIJDKYtyqQB5qFUWcfcR3o2" },
  { name: "Bus Sanjaya trans", id: "1i0DuWj0ymEul8N_1CamJVA_ZdC0nAk96" },
  { name: "Bus LiZ", id: "11GxzHviT1JWod0jzZNpAW8279JqrwX27" },
  { name: "bus konita", id: "1Be-FzWpxUnGa8m79UV_pIZUeG6bnoKGN" },
  { name: "Bus Josal", id: "1WsLhy3JagaVizd4vEP1Zg8III1Q5qDDs" },
  { name: "Bus blue start", id: "1g3yRBPsjTy1x0qK1GeyRRjPOcHTtRJ4k" },
  { name: "Bus big bird", id: "1s-S1I7fSNevqiQmojVTGLleh8DUYyGea" },
  { name: "Bagong", id: "1pQiVDia2O0f-yvIzP2HOxLPftAlu0PbK" },
  { name: "ALKAWAKIBI", id: "1-QqkL_tBF0Vfjgjti_kLj5NZ8W4g9zF6" },
].map(({ name, id }) => ({
  name,
  url: `https://drive.google.com/open?id=${id}&usp=drive_copy`,
}));

export function filterPartners(items, query) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return items;
  return items.filter((partner) => partner.name.toLocaleLowerCase().includes(normalizedQuery));
}
