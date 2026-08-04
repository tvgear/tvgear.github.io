/**
 * TVGEAR Products sync API for Google Apps Script.
 *
 * Setup:
 * 1. Open the Google Sheet > Extensions > Apps Script, replace Code.gs with this file.
 * 2. Run setupProductsSheet once, then Deploy > New deployment > Web app.
 * 3. Set access to "Anyone" and copy the Web App URL to NEXT_PUBLIC_PRODUCTS_API_URL.
 * 4. Configure the Web App URL on the site. The first Products page load will
 *    automatically populate a brand-new Products tab from the local catalogue.
 */
const PRODUCTS_SHEET_NAME = "Products";
const PRODUCTS_HEADERS = [
  "ID", "Category", "Group", "Brand", "Name", "Visible", "Connections", "Colors JSON", "Options JSON", "Updated at",
];
const PRODUCTS_INITIALIZED_PROPERTY = "tvgearProductsInitialized";

function getProductsSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(PRODUCTS_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(PRODUCTS_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, PRODUCTS_HEADERS.length).setValues([PRODUCTS_HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, PRODUCTS_HEADERS.length).setFontWeight("bold").setBackground("#17191c").setFontColor("#ffffff");
    sheet.autoResizeColumns(1, PRODUCTS_HEADERS.length);
  }
  return sheet;
}

function setupProductsSheet() {
  getProductsSheet_();
}

function doGet(event) {
  if (event.parameter.action === "orders") return jsonResponse_({ ok: true, ...readOrders_() });
  return jsonResponse_({ ok: true, products: readProducts_(), initialized: isProductsInitialized_() });
}

function doPost(event) {
  try {
    const payload = JSON.parse(event.postData.contents || "{}");
    if (payload.action === "upsert") return jsonResponse_({ ok: true, product: upsertProduct_(payload.product) });
    if (payload.action === "replace") return jsonResponse_({ ok: true, count: replaceProducts_(payload.products) });
    if (payload.action === "delete") return jsonResponse_({ ok: true, id: deleteProduct_(payload.id) });
    return jsonResponse_({ ok: false, error: "Unsupported action" });
  } catch (error) {
    return jsonResponse_({ ok: false, error: error.message || String(error) });
  }
}

function readProducts_() {
  const sheet = getProductsSheet_();
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, PRODUCTS_HEADERS.length).getValues().map(rowToProduct_);
}

function readOrders_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  if (!sheet || sheet.getLastRow() === 0) return { headers: [], rows: [] };
  const values = sheet.getDataRange().getDisplayValues();
  return { headers: values[0], rows: values.slice(1).filter((row) => row.some((cell) => cell !== "")) };
}

function upsertProduct_(product) {
  if (!product || !product.id) throw new Error("Product ID is required");
  const sheet = getProductsSheet_();
  const data = sheet.getDataRange().getValues();
  const row = productToRow_(product);
  const existingIndex = data.slice(1).findIndex((values) => String(values[0]) === product.id);
  if (existingIndex === -1) sheet.appendRow(row);
  else sheet.getRange(existingIndex + 2, 1, 1, row.length).setValues([row]);
  setProductsInitialized_();
  return product;
}

function replaceProducts_(products) {
  if (!Array.isArray(products)) throw new Error("Products must be an array");
  const sheet = getProductsSheet_();
  if (sheet.getLastRow() > 1) sheet.deleteRows(2, sheet.getLastRow() - 1);
  if (products.length) {
    const rows = products.map(productToRow_);
    sheet.getRange(2, 1, rows.length, PRODUCTS_HEADERS.length).setValues(rows);
  }
  setProductsInitialized_();
  return products.length;
}

function deleteProduct_(id) {
  const sheet = getProductsSheet_();
  const values = sheet.getDataRange().getValues();
  const index = values.slice(1).findIndex((row) => String(row[0]) === id);
  if (index === -1) throw new Error("Product not found");
  sheet.deleteRow(index + 2);
  setProductsInitialized_();
  return id;
}

function productToRow_(product) {
  return [
    product.id, product.category, product.group, product.brand, product.name, product.visible !== false,
    JSON.stringify(product.connect || []), JSON.stringify(product.colors || []), JSON.stringify(product.options || []), new Date(),
  ];
}

function isProductsInitialized_() {
  return PropertiesService.getDocumentProperties().getProperty(PRODUCTS_INITIALIZED_PROPERTY) === "true";
}

function setProductsInitialized_() {
  PropertiesService.getDocumentProperties().setProperty(PRODUCTS_INITIALIZED_PROPERTY, "true");
}

function rowToProduct_(row) {
  return {
    id: String(row[0]), category: String(row[1]), group: String(row[2]), brand: String(row[3]), name: String(row[4]),
    visible: row[5] !== false, connect: parseJson_(row[6], []), colors: parseJson_(row[7], []),
    options: parseJson_(row[8], []),
  };
}

function parseJson_(value, fallback) {
  try { return JSON.parse(String(value || "")); } catch (_) { return fallback; }
}

function jsonResponse_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
