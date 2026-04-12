// Paste this in Google Apps Script (script.google.com)
// Then deploy as Web App (Execute as: Me, Who has access: Anyone)

const SHEET_NAME = "Enrollments";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Create sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        "S.No", "Full Name", "Email ID", "Phone Number",
        "Pass Out Year", "Branch", "Submitted At"
      ];
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setValues([headers]);
      headerRange.setBackground("#4f46e5");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 60);
      sheet.setColumnWidth(2, 180);
      sheet.setColumnWidth(3, 220);
      sheet.setColumnWidth(4, 150);
      sheet.setColumnWidth(5, 130);
      sheet.setColumnWidth(6, 200);
      sheet.setColumnWidth(7, 200);
    }

    // Handle both JSON and form-encoded data
    let data = {};
    if (e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const lastRow = sheet.getLastRow();
    const sno = lastRow;
    const timestamp = Utilities.formatDate(
      new Date(), Session.getScriptTimeZone(), "dd-MM-yyyy HH:mm:ss"
    );

    const newRow = [sno, data.name, data.email, data.phone, data.passout, data.branch, timestamp];
    sheet.appendRow(newRow);

    const rowIndex = sheet.getLastRow();
    if (rowIndex % 2 === 0) {
      sheet.getRange(rowIndex, 1, 1, newRow.length).setBackground("#f1f5f9");
    }
    sheet.getRange(rowIndex, 1).setHorizontalAlignment("center");
    sheet.getRange(rowIndex, 5).setHorizontalAlignment("center");
    sheet.getRange(rowIndex, 7).setHorizontalAlignment("center");

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
