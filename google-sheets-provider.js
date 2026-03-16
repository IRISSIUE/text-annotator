import {
  googleApiKey,
  extractIDFromGoogleSheetURL,
} from "./google-sheet-config.js";

/**
 * GoogleSheetsProvider fetching data from 4 tabs: Metadata, Lines, Annotations, Styles
 */
export const GoogleSheetsProvider = {
  spreadsheetId: extractIDFromGoogleSheetURL(),
  apiKey: googleApiKey,

  async fetchSheetData(range) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${range}?key=${this.apiKey}`;
    console.log("Fetching data from Google Sheets API:", url);
    try {
      const response = await fetch(url);
      console.log(`Response status for range ${range}:`, response.status);
      if (!response.ok) {
        throw new Error(`Google Sheets API error: ${response.statusText}`);
      }
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error(`Error fetching range ${range}:`, error);
      return [];
    }
  },

  /**
   * Identifies column indices by name from the first row of a sheet
   */
  mapColumns(headerRow) {
    const map = {};
    if (!headerRow) return map;
    headerRow.forEach((title, index) => {
      if (title) {
        map[title.trim().toLowerCase()] = index;
      }
    });
    return map;
  },

  async getMetadata() {
    const rows = await this.fetchSheetData("Metadata!A1:Z2");
    console.log("Metadata rows:", rows);
    if (rows.length >= 2) {
      const headers = this.mapColumns(rows[0]);
      const data = rows[1];
      return {
        title: data[headers["title"]] || "",
        author: data[headers["author"]] || "",
        annotator: data[headers["annotator"]] || "IRIS Center",
      };
    }
    return { title: "", author: "", annotator: "" };
  },

  async getLines() {
    const rows = await this.fetchSheetData("Lines!A1:Z");
    console.log("Lines rows:", rows);
    if (rows.length < 2) return [];

    const headers = this.mapColumns(rows[0]);
    const lineIdx = headers["line"];

    // Return all data rows (starting from index 1)
    return rows.slice(1).map((row, index) => ({
      id: index + 1,
      text: lineIdx !== undefined ? row[lineIdx] || "" : "",
    }));
  },

  async getAnnotations() {
    const rows = await this.fetchSheetData("Annotations!A1:Z");
    console.log("Annotations rows:", rows);
    if (rows.length < 2) return [];

    const headers = this.mapColumns(rows[0]);
    return rows.slice(1).map((row) => ({
      id: row[headers["id"]] || "",
      title: row[headers["title"]] || "",
      content: row[headers["content"]] || "",
      mediaUrl: row[headers["media url"]] || "",
      mediaPosition: row[headers["media position"]] || "",
      styleId: row[headers["style id"]] || "",
    }));
  },

  async getStyles() {
    const rows = await this.fetchSheetData("Styles!A1:Z");
    console.log("Styles rows:", rows);
    if (rows.length < 2) return [];

    const headers = this.mapColumns(rows[0]);
    return rows.slice(1).map((row) => ({
      id: row[headers["id"]] || "",
      fontFamily: row[headers["font family"]] || "",
      fontSize: row[headers["font size"]] || "",
      fontStyle: row[headers["font style"]] || "",
      fontWeight: row[headers["font weight"]] || "",
      letterSpacing: row[headers["letter spacing"]] || "",
      fontStretch: row[headers["font stretch"]] || "",
      textTransform: row[headers["text transform"]] || "",
      color: row[headers["color"]] || "",
      activeColor: row[headers["active color"]] || "",
    }));
  },
};
