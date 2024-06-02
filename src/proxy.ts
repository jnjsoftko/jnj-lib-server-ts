/**
 * A Server for Proxy(Web/Local/Google/Notion)
 *
 * @packageDocumentation
 *
 */
import express from "express";
const app = express();
import cors from "cors";
import bodyParser from "body-parser";

import { loadJson, saveJson, rowsFromCsv } from "jnj-lib-base";
import { GoogleSheets } from "jnj-lib-google";
import { Notion } from "jnj-lib-notion";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// & PROXY WEB
/**
 * GET web proxy(General)
 *
 * @example
 * Thunder Client: GET Proxy Web(General) Json
 */
app.get("/web/:url(*)", async (req, res) => {
  const { url } = req.params;
  const response = await fetch(url);
  const str = await response.text();
  res.json(str);
});

/**
 * POST web proxy(General)
 *
 * @example
 * Thunder Client: POST Proxy Web(General) Json
 */
app.post("/web", async (req, res) => {
  const { url, options } = req.body;
  const response = await fetch(url, options);
  res.json(await response.json());
});

// & PROXY LOCAL
/**
 * GET Load Json
 *
 * @example
 * Thunder Client: GET Proxy Local LoadJson
 */
app.get("/local/json/:path(*)", async (req, res) => {
  res.json(loadJson(req.params.path));
});

/**
 * POST Save Json
 *
 * @example
 * Thunder Client: POST Local SaveJson
 */
app.post("/local/json/:path(*)", async (req, res) => {
  saveJson(req.params.path, req.body);
  res.json(req.body);
});

// & PROXY GOOGLE SHEET
/**
 * GET GoogleSheets(Query)
 *
 * @example
 * Thunder Client: GET GoogleSheets(Query)
 */
app.get("/googlesheets/query", async (req, res) => {
  let url = `https://docs.google.com/spreadsheets/d/${req.query.spreadsheetId}/gviz/tq?sheet=${req.query.sheetName}&tq=${encodeURIComponent(
    req.query.query
  )}&tqx=out:csv`;
  const response = await fetch(url);
  const str = await response.text();
  const csv = await rowsFromCsv(str);
  res.json(csv);
});

/**
 * GET GoogleSheets(Read)
 *
 * @example
 * Thunder Client: GET GoogleSheets(Read)
 */
app.get("/googlesheets", async (req, res) => {
  const gs = new GoogleSheets("mooninlearn");
  const { range, sheetName, spreadsheetId } = req.query;
  const values = await gs.getValues(range, sheetName, spreadsheetId);
  console.log("values", values);

  res.json(values);
});

/**
 * POST GoogleSheets(Write)
 *
 * @example
 * Thunder Client: POST GoogleSheets(Write)
 */
app.post("/googlesheets", async (req, res) => {
  const gs = new GoogleSheets({"mooninlearn"});
  const { start, sheetName, spreadsheetId } = req.query;
  const values = await gs.setValues(req.body, start, sheetName, spreadsheetId);

  res.json(values);
});

// & PROXY NOTION
/**
 * GET Notion Users(List)
 *
 * @example
 * Thunder Client: GET Notion Users(List)
 */
app.get("/notion/users", async (req, res) => {
  const notion = new Notion();
  res.json(await notion.getUsers());
});

// & LISTEN
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
