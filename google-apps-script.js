// Paste this in Google Apps Script (script.google.com)
// Then deploy as Web App (Execute as: Me, Who has access: Anyone)

const CONTACT_SHEET_NAME = "Contact Messages";
const ERRORS_SHEET_NAME = "Errors";

const BRANCH_MAP = {
  "Computer Science": "CSE",
  "Information Technology": "IT",
  "Electronics & Communication": "ECE",
  "Electrical Engineering": "EEE",
  "Mechanical Engineering": "MECH",
  "Civil Engineering": "CIVIL"
};

const COMMON_HEADERS = [
  "S.No", "Full Name", "Email ID", "Phone Number",
  "Pass Out Year", "Branch", "Course Selected", "Assistance Type", "Domain Interest", "Submitted At"
];

const CONTACT_HEADERS = [
  "S.No", "Full Name", "Email ID", "Phone Number",
  "Interested In", "Message", "Submitted At"
];

const COMMON_WIDTHS = [60, 180, 220, 150, 130, 150, 200, 200, 220, 180];
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

    // Decide target sheet based on form type and branch for enroll/placement
    const formType = (data.formType || "").toLowerCase();
    
    let targetSheetName = "Other";
    let headers = COMMON_HEADERS;
    let widths = COMMON_WIDTHS;
    
    if (formType === "contact") {
      targetSheetName = CONTACT_SHEET_NAME;
      headers = CONTACT_HEADERS;
      widths = CONTACT_WIDTHS;
    } else {
      const branchRaw = data.branch || "Other";
      targetSheetName = BRANCH_MAP[branchRaw] || "Other";
    }

    let sheet = ss.getSheetByName(targetSheetName);

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
    if (formType === "contact") {
      newRow = [
        sno, data.name, data.email, data.phone, data.interestedIn, data.message, timestamp
      ];
    } else {
      // both enrollment and placement fill this common row
      newRow = [
        sno,
        data.name || "",
        data.email || "",
        data.phone || "",
        data.passout || "",
        data.branch || "",
        data.course || "",
        data.assistanceType || "",
        data.domainInterest || "",
        timestamp
      ];
    }
    
    sheet.appendRow(newRow);

    const rowIndex = sheet.getLastRow();
    if (rowIndex % 2 === 0) {
      sheet.getRange(rowIndex, 1, 1, newRow.length).setBackground("#f1f5f9");
    }
    sheet.getRange(rowIndex, 1).setHorizontalAlignment("center");

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let errSheet = ss.getSheetByName(ERRORS_SHEET_NAME);
    if (!errSheet) {
      errSheet = ss.insertSheet(ERRORS_SHEET_NAME);
      errSheet.appendRow(["Timestamp", "Error Message", "Stack"]);
    }
    const timestamp = Utilities.formatDate(
      new Date(), Session.getScriptTimeZone(), "dd-MM-yyyy HH:mm:ss"
    );
    errSheet.appendRow([timestamp, err.message, err.stack]);
    
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
