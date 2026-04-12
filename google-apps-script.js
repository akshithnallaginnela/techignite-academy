// Paste this in Google Apps Script (script.google.com)
// Then deploy as Web App (Execute as: Me, Who has access: Anyone)

const SHEET_NAME = "Enrollments";
const PLACEMENT_SHEET_NAME = "Placement Assistance";
const CONTACT_SHEET_NAME = "Contact Messages";

const ENROLL_HEADERS = [
  "S.No", "Full Name", "Email ID", "Phone Number",
  "Pass Out Year", "Branch", "Submitted At"
];

const PLACEMENT_HEADERS = [
  "S.No", "Full Name", "Email ID", "Phone Number",
  "Pass Out Year", "Branch", "Assistance Type", "Domain Interest", "Submitted At"
];

const CONTACT_HEADERS = [
  "S.No", "Full Name", "Email ID", "Phone Number",
  "Interested In", "Message", "Submitted At"
];

const ENROLL_WIDTHS = [60, 180, 220, 150, 130, 200, 200];
const PLACEMENT_WIDTHS = [60, 180, 220, 150, 130, 200, 200, 220, 200];
const CONTACT_WIDTHS = [60, 180, 220, 150, 160, 320, 200];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let data = {};
    if (e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    // Decide target sheet based on form type
    const formType = (data.formType || "").toLowerCase();
    let targetSheetName = SHEET_NAME;
    if (formType === "placement") {
      targetSheetName = PLACEMENT_SHEET_NAME;
    } else if (formType === "contact") {
      targetSheetName = CONTACT_SHEET_NAME;
    }

    let sheet = ss.getSheetByName(targetSheetName);
    let headers = ENROLL_HEADERS;
    let widths = ENROLL_WIDTHS;
    if (targetSheetName === PLACEMENT_SHEET_NAME) {
      headers = PLACEMENT_HEADERS;
      widths = PLACEMENT_WIDTHS;
    } else if (targetSheetName === CONTACT_SHEET_NAME) {
      headers = CONTACT_HEADERS;
      widths = CONTACT_WIDTHS;
    }

    // Create sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
    }

    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    const existingHeaders = headerRange.getValues()[0];
    if (existingHeaders.join("|") !== headers.join("|")) {
      headerRange.setValues([headers]);
      headerRange.setBackground("#4f46e5");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);

      headers.forEach((_, index) => {
        const width = widths[index] || 180;
        sheet.setColumnWidth(index + 1, width);
      });
    }

    const lastRow = sheet.getLastRow();
    const sno = lastRow;
    const timestamp = Utilities.formatDate(
      new Date(), Session.getScriptTimeZone(), "dd-MM-yyyy HH:mm:ss"
    );

    let newRow = [];
    if (targetSheetName === PLACEMENT_SHEET_NAME) {
      newRow = [
        sno,
        data.name,
        data.email,
        data.phone,
        data.passout,
        data.branch,
        data.assistanceType,
        data.domainInterest,
        timestamp
      ];
    } else if (targetSheetName === CONTACT_SHEET_NAME) {
      newRow = [
        sno,
        data.name,
        data.email,
        data.phone,
        data.interestedIn,
        data.message,
        timestamp
      ];
    } else {
      newRow = [sno, data.name, data.email, data.phone, data.passout, data.branch, timestamp];
    }
    sheet.appendRow(newRow);

    const rowIndex = sheet.getLastRow();
    if (rowIndex % 2 === 0) {
      sheet.getRange(rowIndex, 1, 1, newRow.length).setBackground("#f1f5f9");
    }
    sheet.getRange(rowIndex, 1).setHorizontalAlignment("center");
    sheet.getRange(rowIndex, 5).setHorizontalAlignment("center");
    sheet.getRange(rowIndex, newRow.length).setHorizontalAlignment("center");

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
