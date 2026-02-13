/**
 * Google Apps Script Webhook for Digital Arup orders
 * 1) Create a Google Sheet
 * 2) Extensions -> Apps Script
 * 3) Paste this code
 * 4) Deploy -> New deployment -> Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5) Copy Web App URL and set as GOOGLE_SHEETS_WEBHOOK_URL
 */

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = "orders";
    const sh = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    // header
    if (sh.getLastRow() === 0) {
      sh.appendRow(["created_at","order_id","ebook_title","amount","utr","coupon","affiliate","user_email","ebook_slug"]);
    }

    const body = JSON.parse(e.postData.contents);

    sh.appendRow([
      body.created_at || new Date().toISOString(),
      body.order_id || "",
      body.ebook_title || "",
      body.amount || "",
      body.utr || "",
      body.coupon || "",
      body.affiliate || "",
      body.user_email || "",
      body.ebook_slug || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
