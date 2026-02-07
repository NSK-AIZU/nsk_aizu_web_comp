const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat, ImageRun
} = require("docx");

// ========== Color Palette ==========
const COLORS = {
  darkNavy: "1A2520",
  green: "3D7A50",
  greenLight: "EEF2EE",
  teal: "2D6A6A",
  amber: "B8860B",
  amberLight: "FFF8E7",
  text: "1A2520",
  textSub: "4A5550",
  textMuted: "7A8580",
  border: "CCCCCC",
  borderLight: "E0E0E0",
  bgLight: "F5F7F5",
  white: "FFFFFF",
  warningBg: "FFF3CD",
  warningBorder: "FFC107",
  infoBg: "E3F2FD",
  infoBorder: "2196F3",
  codeBg: "F4F4F4",
};

// ========== Helpers ==========
const border = { style: BorderStyle.SINGLE, size: 1, color: COLORS.border };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, children: [new TextRun(text)] });
}

function text(content, options = {}) {
  return new Paragraph({
    spacing: { after: 200 },
    ...options.paraOptions,
    children: [new TextRun({ size: 22, color: COLORS.text, ...options, text: content })],
  });
}

function richParagraph(runs, paraOptions = {}) {
  return new Paragraph({
    spacing: { after: 200 },
    ...paraOptions,
    children: runs,
  });
}

function codeBlock(lines) {
  return lines.map((line, i) =>
    new Paragraph({
      spacing: { after: i === lines.length - 1 ? 200 : 40 },
      shading: { fill: COLORS.codeBg, type: ShadingType.CLEAR },
      indent: { left: 360 },
      children: [new TextRun({ font: "Courier New", size: 20, color: COLORS.textSub, text: line })],
    })
  );
}

function numberedItem(ref, level, content, bold = false) {
  return new Paragraph({
    numbering: { reference: ref, level },
    spacing: { after: 120 },
    children: [new TextRun({ size: 22, color: COLORS.text, bold, text: content })],
  });
}

function bulletItem(ref, level, content) {
  return new Paragraph({
    numbering: { reference: ref, level },
    spacing: { after: 100 },
    children: [new TextRun({ size: 22, color: COLORS.text, text: content })],
  });
}

function noteBox(title, content, fillColor = COLORS.amberLight) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.warningBorder },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.warningBorder },
              left: { style: BorderStyle.SINGLE, size: 6, color: COLORS.warningBorder },
              right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.warningBorder },
            },
            shading: { fill: fillColor, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            width: { size: 9360, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: [new TextRun({ size: 22, bold: true, color: COLORS.amber, text: title })],
              }),
              new Paragraph({
                children: [new TextRun({ size: 20, color: COLORS.textSub, text: content })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function infoBox(title, content) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.infoBorder },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.infoBorder },
              left: { style: BorderStyle.SINGLE, size: 6, color: COLORS.infoBorder },
              right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.infoBorder },
            },
            shading: { fill: COLORS.infoBg, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            width: { size: 9360, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: [new TextRun({ size: 22, bold: true, color: COLORS.infoBorder, text: title })],
              }),
              new Paragraph({
                children: [new TextRun({ size: 20, color: COLORS.textSub, text: content })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function spacer(height = 200) {
  return new Paragraph({ spacing: { after: height }, children: [] });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.borderLight } },
    children: [],
  });
}

// ========== Document ==========
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: COLORS.text } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: COLORS.darkNavy },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: COLORS.green },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: COLORS.teal },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "steps",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "substeps",
        levels: [{
          level: 0, format: LevelFormat.LOWER_LATIN, text: "%1)",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } },
        }],
      },
      {
        reference: "bullets1",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "bullets2",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "checkA",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2610",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({ size: 16, color: COLORS.textMuted, font: "Arial", text: "NPO NSK_AIZU | GitHub" }),
                new TextRun({ size: 16, color: COLORS.textMuted, font: "Arial", text: "\u53CD\u6620\u624B\u9806\u30AC\u30A4\u30C9" }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ size: 16, color: COLORS.textMuted, text: "Page " }),
                new TextRun({ size: 16, color: COLORS.textMuted, children: [PageNumber.CURRENT] }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ===== Title =====
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [new TextRun({ size: 40, bold: true, color: COLORS.darkNavy, text: "\u300C\u9078\u6319\u306E\u9054\u4EBA 2026\u300D" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ size: 28, color: COLORS.green, text: "GitHub\u3078\u306E\u53CD\u6620\u624B\u9806\u30AC\u30A4\u30C9" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ size: 18, color: COLORS.textMuted, text: "NPO\u6CD5\u4EBA NSK_AIZU \u6559\u80B2\u652F\u63F4\u30DA\u30FC\u30B8\u3078\u306E\u8FFD\u52A0" })],
        }),

        // ===== Overview =====
        heading("\u6982\u8981", HeadingLevel.HEADING_1),
        text("\u4ECA\u56DE\u8FFD\u52A0\u3059\u308B\u30D5\u30A1\u30A4\u30EB\u306F\u4EE5\u4E0B\u306E2\u3064\u3067\u3059\u3002"),
        spacer(100),

        // File table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [3800, 5560],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders,
                  width: { size: 3800, type: WidthType.DXA },
                  shading: { fill: COLORS.greenLight, type: ShadingType.CLEAR },
                  margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ size: 20, bold: true, text: "\u30D5\u30A1\u30A4\u30EB" })] })],
                }),
                new TableCell({
                  borders,
                  width: { size: 5560, type: WidthType.DXA },
                  shading: { fill: COLORS.greenLight, type: ShadingType.CLEAR },
                  margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ size: 20, bold: true, text: "\u8AAC\u660E" })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders, margins: cellMargins,
                  width: { size: 3800, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ size: 20, font: "Courier New", text: "education/senkyo-game/index.html" })] })],
                }),
                new TableCell({
                  borders, margins: cellMargins,
                  width: { size: 5560, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ size: 20, text: "\u9078\u6319\u306E\u9054\u4EBA 2026 \u30B2\u30FC\u30E0\u672C\u4F53\uFF08\u65B0\u898F\u8FFD\u52A0\uFF09" })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders, margins: cellMargins,
                  width: { size: 3800, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ size: 20, font: "Courier New", text: "education/index.html" })] })],
                }),
                new TableCell({
                  borders, margins: cellMargins,
                  width: { size: 5560, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ size: 20, text: "\u6559\u80B2\u652F\u63F4\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8\uFF08\u30EA\u30F3\u30AF\u8FFD\u52A0\u306E\u305F\u3081\u66F4\u65B0\uFF09" })] })],
                }),
              ],
            }),
          ],
        }),
        spacer(100),

        text("\u53CD\u6620\u65B9\u6CD5\u306F2\u3064\u3042\u308A\u307E\u3059\u3002\u304A\u597D\u307F\u306E\u65B9\u6CD5\u3092\u304A\u9078\u3073\u304F\u3060\u3055\u3044\u3002"),
        spacer(100),

        // Method comparison table
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [3120, 3120, 3120],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders,
                  width: { size: 3120, type: WidthType.DXA },
                  shading: { fill: COLORS.greenLight, type: ShadingType.CLEAR },
                  margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ size: 20, bold: true, text: "" })] })],
                }),
                new TableCell({
                  borders,
                  width: { size: 3120, type: WidthType.DXA },
                  shading: { fill: COLORS.greenLight, type: ShadingType.CLEAR },
                  margins: cellMargins,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ size: 20, bold: true, text: "\u65B9\u6CD5A: Web\u30D6\u30E9\u30A6\u30B6" })] })],
                }),
                new TableCell({
                  borders,
                  width: { size: 3120, type: WidthType.DXA },
                  shading: { fill: COLORS.greenLight, type: ShadingType.CLEAR },
                  margins: cellMargins,
                  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ size: 20, bold: true, text: "\u65B9\u6CD5B: \u30B3\u30DE\u30F3\u30C9\u30E9\u30A4\u30F3" })] })],
                }),
              ],
            }),
            ...[
              ["\u96E3\u6613\u5EA6", "\u2B50 \u521D\u5FC3\u8005\u5411\u3051", "\u2B50\u2B50 \u4E2D\u7D1A\u8005\u5411\u3051"],
              ["\u5FC5\u8981\u306A\u3082\u306E", "Web\u30D6\u30E9\u30A6\u30B6\u306E\u307F", "Git\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u6E08\u307F"],
              ["\u6240\u8981\u6642\u9593", "\u7D045\u5206", "\u7D043\u5206"],
              ["\u304A\u3059\u3059\u3081", "Git\u306B\u4E0D\u614E\u308C\u306A\u65B9", "Git\u306B\u614E\u308C\u3066\u3044\u308B\u65B9"],
            ].map(([label, a, b]) =>
              new TableRow({
                children: [
                  new TableCell({ borders, margins: cellMargins, width: { size: 3120, type: WidthType.DXA },
                    children: [new Paragraph({ children: [new TextRun({ size: 20, bold: true, text: label })] })] }),
                  new TableCell({ borders, margins: cellMargins, width: { size: 3120, type: WidthType.DXA },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ size: 20, text: a })] })] }),
                  new TableCell({ borders, margins: cellMargins, width: { size: 3120, type: WidthType.DXA },
                    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ size: 20, text: b })] })] }),
                ],
              })
            ),
          ],
        }),

        // ===== Page Break =====
        new Paragraph({ children: [new PageBreak()] }),

        // ===== Method A: Web Browser =====
        heading("\u65B9\u6CD5A: GitHub Web\u30D6\u30E9\u30A6\u30B6\u304B\u3089\u8FFD\u52A0\uFF08\u521D\u5FC3\u8005\u5411\u3051\uFF09", HeadingLevel.HEADING_1),
        text("Git\u306E\u30B3\u30DE\u30F3\u30C9\u3092\u4F7F\u308F\u305A\u3001\u30D6\u30E9\u30A6\u30B6\u4E0A\u3060\u3051\u3067\u5B8C\u7D50\u3059\u308B\u65B9\u6CD5\u3067\u3059\u3002"),
        spacer(100),

        // --- Step 1 ---
        heading("Step 1: \u30EA\u30DD\u30B8\u30C8\u30EA\u3092\u958B\u304F", HeadingLevel.HEADING_2),
        text("\u30D6\u30E9\u30A6\u30B6\u3067\u4EE5\u4E0B\u306EURL\u3092\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002"),
        spacer(60),
        new Paragraph({
          spacing: { after: 200 },
          shading: { fill: COLORS.codeBg, type: ShadingType.CLEAR },
          indent: { left: 360 },
          children: [new TextRun({ font: "Courier New", size: 20, color: COLORS.teal, text: "https://github.com/NSK-AIZU/nsk_aizu_web_comp" })],
        }),
        spacer(60),
        text("GitHub\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u3044\u306A\u3044\u5834\u5408\u306F\u3001\u5148\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),

        // --- Step 2 ---
        heading("Step 2: \u30B2\u30FC\u30E0\u30D5\u30A1\u30A4\u30EB\u3092\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9", HeadingLevel.HEADING_2),
        numberedItem("steps", 0, "education \u30D5\u30A9\u30EB\u30C0\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3066\u958B\u304D\u307E\u3059"),
        numberedItem("steps", 0, "\u53F3\u4E0A\u306E\u300CAdd file\u300D\u30DC\u30BF\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u307E\u3059"),
        numberedItem("steps", 0, "\u300CCreate new file\u300D\u3092\u9078\u629E\u3057\u307E\u3059"),
        numberedItem("steps", 0, "\u30D5\u30A1\u30A4\u30EB\u540D\u306E\u5165\u529B\u6B04\u306B\u4EE5\u4E0B\u3092\u5165\u529B\u3057\u307E\u3059\uFF1A"),
        ...codeBlock(["senkyo-game/index.html"]),

        noteBox(
          "\u2757 \u30DD\u30A4\u30F3\u30C8",
          "senkyo-game/ \u3068\u5165\u529B\u3059\u308B\u3068\u81EA\u52D5\u7684\u306B\u30D5\u30A9\u30EB\u30C0\u304C\u4F5C\u6210\u3055\u308C\u3001\u7D9A\u3051\u3066 index.html \u3068\u5165\u529B\u3067\u304D\u307E\u3059\u3002\u300C/\u300D\u3092\u5165\u529B\u3059\u308B\u3068\u30D5\u30A9\u30EB\u30C0\u304C\u5206\u304B\u308C\u307E\u3059\u3002"
        ),
        spacer(200),

        numberedItem("steps", 0, "\u30A8\u30C7\u30A3\u30BF\u90E8\u5206\u306B\u3001\u9078\u3093\u3060\u30D5\u30A9\u30EB\u30C0\u5185\u306E index.html \u306E\u5185\u5BB9\u3092\u8CBC\u308A\u4ED8\u3051\u307E\u3059"),
        spacer(60),
        infoBox(
          "\uD83D\uDCCB \u30D5\u30A1\u30A4\u30EB\u306E\u5185\u5BB9\u306E\u30B3\u30D4\u30FC\u65B9\u6CD5",
          "\u9078\u3093\u3060\u30D5\u30A9\u30EB\u30C0\u306E education/senkyo-game/index.html \u3092\u30C6\u30AD\u30B9\u30C8\u30A8\u30C7\u30A3\u30BF\uFF08\u30E1\u30E2\u5E33\u7B49\uFF09\u3067\u958B\u304D\u3001\u5168\u9078\u629E\uFF08Ctrl+A\uFF09\u2192 \u30B3\u30D4\u30FC\uFF08Ctrl+C\uFF09\u2192 GitHub\u306E\u30A8\u30C7\u30A3\u30BF\u306B\u8CBC\u308A\u4ED8\u3051\uFF08Ctrl+V\uFF09\u3057\u3066\u304F\u3060\u3055\u3044\u3002"
        ),
        spacer(200),

        numberedItem("steps", 0, "\u30DA\u30FC\u30B8\u4E0B\u90E8\u306E\u300CCommit changes...\u300D\u30DC\u30BF\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u307E\u3059"),
        numberedItem("steps", 0, "\u30B3\u30DF\u30C3\u30C8\u30E1\u30C3\u30BB\u30FC\u30B8\u306B\u4EE5\u4E0B\u3092\u5165\u529B\u3057\u307E\u3059\uFF1A"),
        ...codeBlock(["Add senkyo-game (Election Master 2026) to education section"]),
        numberedItem("steps", 0, "\u300CCommit directly to the main branch\u300D\u3092\u9078\u629E\u3057\u3001\u300CCommit changes\u300D\u3092\u30AF\u30EA\u30C3\u30AF"),

        spacer(200),

        // --- Step 3 ---
        heading("Step 3: \u6559\u80B2\u652F\u63F4\u30C8\u30C3\u30D7\u30DA\u30FC\u30B8\u3092\u66F4\u65B0", HeadingLevel.HEADING_2),
        text("\u6B21\u306B\u3001\u6559\u80B2\u652F\u63F4\u30DA\u30FC\u30B8\uFF08education/index.html\uFF09\u306B\u30B2\u30FC\u30E0\u3078\u306E\u30EA\u30F3\u30AF\u3092\u8FFD\u52A0\u3057\u307E\u3059\u3002"),
        spacer(60),

        numberedItem("steps", 0, "\u30EA\u30DD\u30B8\u30C8\u30EA\u306E\u30C8\u30C3\u30D7\u306B\u623B\u308A\u3001education \u30D5\u30A9\u30EB\u30C0\u3092\u958B\u304D\u307E\u3059"),
        numberedItem("steps", 0, "index.html \u3092\u30AF\u30EA\u30C3\u30AF\u3057\u307E\u3059"),
        numberedItem("steps", 0, "\u53F3\u4E0A\u306E\u925B\u7B46\u30A2\u30A4\u30B3\u30F3\uFF08\u7DE8\u96C6\u30DC\u30BF\u30F3\uFF09\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u307E\u3059"),
        numberedItem("steps", 0, "\u30D5\u30A1\u30A4\u30EB\u306E\u5185\u5BB9\u3092\u3059\u3079\u3066\u9078\u629E\uFF08Ctrl+A\uFF09\u3057\u3066\u524A\u9664\u3057\u307E\u3059"),
        numberedItem("steps", 0, "\u9078\u3093\u3060\u30D5\u30A9\u30EB\u30C0\u306E education/index.html \u306E\u5185\u5BB9\u3092\u8CBC\u308A\u4ED8\u3051\u307E\u3059"),
        numberedItem("steps", 0, "\u300CCommit changes...\u300D\u2192 \u30E1\u30C3\u30BB\u30FC\u30B8\u3092\u5165\u529B\u2192 \u300CCommit changes\u300D"),
        ...codeBlock(["Add civic education section with link to election game"]),

        spacer(200),

        // --- Step 4 ---
        heading("Step 4: \u30C7\u30D7\u30ED\u30A4\u78BA\u8A8D", HeadingLevel.HEADING_2),
        text("Cloudflare Pages\u304C\u81EA\u52D5\u7684\u306B\u30C7\u30D7\u30ED\u30A4\u3092\u958B\u59CB\u3057\u307E\u3059\u3002\u901A\u5E38\u300130\u79D2\uFF5E2\u5206\u7A0B\u5EA6\u3067\u53CD\u6620\u3055\u308C\u307E\u3059\u3002"),
        spacer(60),
        text("\u4EE5\u4E0B\u306EURL\u3067\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\uFF1A"),
        bulletItem("bullets1", 0, "\u6559\u80B2\u652F\u63F4\u30DA\u30FC\u30B8: https://npo-nsk-aizu.org/education/"),
        bulletItem("bullets1", 0, "\u9078\u6319\u30B2\u30FC\u30E0: https://npo-nsk-aizu.org/education/senkyo-game/"),


        // ===== Page Break =====
        new Paragraph({ children: [new PageBreak()] }),

        // ===== Method B: Command Line =====
        heading("\u65B9\u6CD5B: \u30B3\u30DE\u30F3\u30C9\u30E9\u30A4\u30F3\u304B\u3089\u8FFD\u52A0\uFF08\u4E2D\u7D1A\u8005\u5411\u3051\uFF09", HeadingLevel.HEADING_1),
        text("Git\u304C\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u6E08\u307F\u306E\u74B0\u5883\u3067\u3001\u30BF\u30FC\u30DF\u30CA\u30EB\u304B\u3089\u64CD\u4F5C\u3059\u308B\u65B9\u6CD5\u3067\u3059\u3002"),
        spacer(100),

        // --- Step 1 ---
        heading("Step 1: \u30EA\u30DD\u30B8\u30C8\u30EA\u3092\u30AF\u30ED\u30FC\u30F3\uFF08\u521D\u56DE\u306E\u307F\uFF09", HeadingLevel.HEADING_2),
        text("\u65E2\u306B\u30AF\u30ED\u30FC\u30F3\u6E08\u307F\u306E\u5834\u5408\u306F\u3001\u6700\u65B0\u306E\u72B6\u614B\u306B\u66F4\u65B0\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
        spacer(60),
        ...codeBlock([
          "# \u521D\u56DE\u306E\u5834\u5408",
          "git clone https://github.com/NSK-AIZU/nsk_aizu_web_comp.git",
          "cd nsk_aizu_web_comp",
          "",
          "# \u65E2\u306B\u30AF\u30ED\u30FC\u30F3\u6E08\u307F\u306E\u5834\u5408",
          "cd nsk_aizu_web_comp",
          "git pull origin main",
        ]),

        // --- Step 2 ---
        heading("Step 2: \u30D5\u30A1\u30A4\u30EB\u3092\u914D\u7F6E", HeadingLevel.HEADING_2),
        text("\u9078\u3093\u3060\u30D5\u30A9\u30EB\u30C0\u306B\u3042\u308B\u30D5\u30A1\u30A4\u30EB\u3092\u30EA\u30DD\u30B8\u30C8\u30EA\u306B\u30B3\u30D4\u30FC\u3057\u307E\u3059\u3002"),
        spacer(60),
        ...codeBlock([
          "# \u30B2\u30FC\u30E0\u30D5\u30A1\u30A4\u30EB\u7528\u306E\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u3092\u4F5C\u6210",
          "mkdir -p education/senkyo-game",
          "",
          "# \u30D5\u30A1\u30A4\u30EB\u3092\u30B3\u30D4\u30FC\uFF08\u30D1\u30B9\u306F\u3054\u81EA\u8EAB\u306E\u74B0\u5883\u306B\u5408\u308F\u305B\u3066\u304F\u3060\u3055\u3044\uFF09",
          "cp [\u9078\u3093\u3060\u30D5\u30A9\u30EB\u30C0]/education/senkyo-game/index.html education/senkyo-game/index.html",
          "cp [\u9078\u3093\u3060\u30D5\u30A9\u30EB\u30C0]/education/index.html education/index.html",
        ]),

        // --- Step 3 ---
        heading("Step 3: \u30B3\u30DF\u30C3\u30C8 & \u30D7\u30C3\u30B7\u30E5", HeadingLevel.HEADING_2),
        ...codeBlock([
          "# \u5909\u66F4\u3092\u78BA\u8A8D",
          "git status",
          "",
          "# \u30B9\u30C6\u30FC\u30B8\u30F3\u30B0",
          "git add education/senkyo-game/index.html",
          "git add education/index.html",
          "",
          "# \u30B3\u30DF\u30C3\u30C8",
          "git commit -m \"Add senkyo-game and civic education section\"",
          "",
          "# \u30D7\u30C3\u30B7\u30E5",
          "git push origin main",
        ]),
        spacer(100),

        text("push\u304C\u5B8C\u4E86\u3059\u308B\u3068\u3001Cloudflare Pages\u304C\u81EA\u52D5\u7684\u306B\u30C7\u30D7\u30ED\u30A4\u3092\u958B\u59CB\u3057\u307E\u3059\u3002"),

        // ===== Page Break =====
        new Paragraph({ children: [new PageBreak()] }),

        // ===== Post-deploy checklist =====
        heading("\u30C7\u30D7\u30ED\u30A4\u5F8C\u306E\u78BA\u8A8D\u30C1\u30A7\u30C3\u30AF\u30EA\u30B9\u30C8", HeadingLevel.HEADING_1),
        spacer(60),

        new Paragraph({
          numbering: { reference: "checkA", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ size: 22, text: "https://npo-nsk-aizu.org/education/ \u3092\u958B\u304D\u3001\u300CCIVIC EDUCATION\u300D\u30BB\u30AF\u30B7\u30E7\u30F3\u304C\u8868\u793A\u3055\u308C\u3066\u3044\u308B\u304B\u78BA\u8A8D" })],
        }),
        new Paragraph({
          numbering: { reference: "checkA", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ size: 22, text: "\u300C\u9078\u6319\u306E\u9054\u4EBA 2026\u300D\u306E\u30EA\u30F3\u30AF\u30AB\u30FC\u30C9\u3092\u30AF\u30EA\u30C3\u30AF\u3057\u3001\u30B2\u30FC\u30E0\u30DA\u30FC\u30B8\u304C\u958B\u304F\u304B\u78BA\u8A8D" })],
        }),
        new Paragraph({
          numbering: { reference: "checkA", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ size: 22, text: "\u30B2\u30FC\u30E0\u30DA\u30FC\u30B8\u3067\u540D\u524D\u5165\u529B\u3001\u8B70\u5E2D\u6570\u4E88\u6E2C\u306A\u3069\u306E\u64CD\u4F5C\u304C\u3067\u304D\u308B\u304B\u78BA\u8A8D" })],
        }),
        new Paragraph({
          numbering: { reference: "checkA", level: 0 },
          spacing: { after: 120 },
          children: [new TextRun({ size: 22, text: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u3067\u3082\u30DA\u30FC\u30B8\u304C\u6B63\u3057\u304F\u8868\u793A\u3055\u308C\u308B\u304B\u78BA\u8A8D" })],
        }),

        spacer(200),

        // ===== Firebase note =====
        heading("Firebase\u306E\u8A2D\u5B9A\u78BA\u8A8D\uFF08\u91CD\u8981\uFF09", HeadingLevel.HEADING_1),
        text("\u9078\u6319\u306E\u9054\u4EBA 2026 \u306F Firebase Realtime Database \u3092\u4F7F\u7528\u3057\u3066\u3044\u307E\u3059\u3002\u30C7\u30FC\u30BF\u306E\u4FDD\u5B58\u30FB\u8AAD\u307F\u8FBC\u307F\u304C\u6B63\u3057\u304F\u52D5\u4F5C\u3059\u308B\u305F\u3081\u306B\u3001\u4EE5\u4E0B\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
        spacer(60),

        heading("\u8A31\u53EF\u30C9\u30E1\u30A4\u30F3\u306E\u8FFD\u52A0", HeadingLevel.HEADING_2),
        numberedItem("steps", 0, "Firebase Console\uFF08https://console.firebase.google.com/\uFF09\u3092\u958B\u304F"),
        numberedItem("steps", 0, "\u30D7\u30ED\u30B8\u30A7\u30AF\u30C8\u300Celection-prediction-2026\u300D\u3092\u9078\u629E"),
        numberedItem("steps", 0, "\u5DE6\u30E1\u30CB\u30E5\u30FC\u306E\u300CAuthentication\u300D\u2192\u300CSettings\u300D\u3092\u958B\u304F"),
        numberedItem("steps", 0, "\u300CAuthorized domains\u300D\u306B npo-nsk-aizu.org \u304C\u542B\u307E\u308C\u3066\u3044\u308B\u304B\u78BA\u8A8D"),
        numberedItem("steps", 0, "\u542B\u307E\u308C\u3066\u3044\u306A\u3051\u308C\u3070\u300CAdd domain\u300D\u3067\u8FFD\u52A0"),

        spacer(100),

        noteBox(
          "\u2757 Firebase Realtime Database\u306E\u30EB\u30FC\u30EB\u306B\u3064\u3044\u3066",
          "\u30C7\u30FC\u30BF\u30D9\u30FC\u30B9\u306E\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u30EB\u30FC\u30EB\u304C\u9069\u5207\u306B\u8A2D\u5B9A\u3055\u308C\u3066\u3044\u308B\u3053\u3068\u3082\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u8A73\u7D30\u306F Firebase Console \u306E Realtime Database \u2192 Rules \u30BF\u30D6\u3067\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002"
        ),
        spacer(200),

        // ===== Sitemap =====
        heading("\u4EFB\u610F: sitemap.xml\u306E\u66F4\u65B0", HeadingLevel.HEADING_1),
        text("SEO\u306E\u305F\u3081\u306B\u3001sitemap.xml \u306B\u65B0\u3057\u3044\u30DA\u30FC\u30B8\u3092\u8FFD\u52A0\u3059\u308B\u3053\u3068\u3092\u304A\u3059\u3059\u3081\u3057\u307E\u3059\u3002\u30EA\u30DD\u30B8\u30C8\u30EA\u30EB\u30FC\u30C8\u306E sitemap.xml \u306B\u4EE5\u4E0B\u3092\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044\u3002"),
        spacer(60),
        ...codeBlock([
          "<url>",
          "  <loc>https://npo-nsk-aizu.org/education/senkyo-game/</loc>",
          "  <lastmod>2026-02-07</lastmod>",
          "  <changefreq>monthly</changefreq>",
          "  <priority>0.7</priority>",
          "</url>",
        ]),

        spacer(200),
        divider(),
        spacer(100),

        // ===== Final structure =====
        heading("\u6700\u7D42\u7684\u306A\u30C7\u30A3\u30EC\u30AF\u30C8\u30EA\u69CB\u9020", HeadingLevel.HEADING_2),
        ...codeBlock([
          "nsk_aizu_web_comp/",
          "\u251C\u2500\u2500 index.html",
          "\u251C\u2500\u2500 about.html",
          "\u251C\u2500\u2500 news.html",
          "\u251C\u2500\u2500 contact.html",
          "\u251C\u2500\u2500 sitemap.xml          \u2190 \u66F4\u65B0\u63A8\u5968",
          "\u251C\u2500\u2500 education/",
          "\u2502   \u251C\u2500\u2500 index.html       \u2190 \u66F4\u65B0\uFF08\u30EA\u30F3\u30AF\u8FFD\u52A0\uFF09",
          "\u2502   \u251C\u2500\u2500 education.css",
          "\u2502   \u251C\u2500\u2500 senkyo-game/     \u2190 \u65B0\u898F\u4F5C\u6210",
          "\u2502   \u2502   \u2514\u2500\u2500 index.html   \u2190 \u65B0\u898F\u8FFD\u52A0",
          "\u2502   \u2514\u2500\u2500 kyotsu-test/",
          "\u2502       \u2514\u2500\u2500 2025/joho1/",
          "\u2514\u2500\u2500 ...",
        ]),

        spacer(200),
        divider(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [new TextRun({ size: 18, color: COLORS.textMuted, italics: true, text: "\u4F5C\u6210: Claude | NPO NSK_AIZU \u6559\u80B2\u652F\u63F4\u30D7\u30ED\u30B0\u30E9\u30E0" })],
        }),
      ],
    },
  ],
});

// Generate
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/sessions/zen-optimistic-heisenberg/mnt/02_hp/GitHub反映手順ガイド.docx", buffer);
  console.log("Document created successfully!");
});
