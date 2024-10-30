// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

figma.showUI(__html__, {width: 1000, height: 700});

figma.ui.onmessage =  (msg) => {
  if (msg.type === 'export') {
    createTable(msg.data)
  }
};

async function createTable(tableData: { headers: string[]; rows: {criteria: string, scores: {value: string, color: string}[]}[]; }) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" })
  try {
    let count = 0;
    const borderColor = { r: 204 / 255, g: 204 / 255, b: 204 / 255 }
    const backgroundColor = { r: 245 / 255, g: 245 / 255, b: 245 / 255 }

    const parentFrame = figma.createFrame();
    parentFrame.resize(652, 324)
    parentFrame.x = 0;
    parentFrame.y = 0;
    parentFrame.strokes = [{ type: 'SOLID', color: borderColor }]
    parentFrame.strokeBottomWeight = 2;
    parentFrame.strokeLeftWeight = 2;
    parentFrame.strokeRightWeight = 2;
    parentFrame.strokeTopWeight = 2
    parentFrame.fills = [{ type: 'SOLID', color: backgroundColor }]
    // Table header
    for (let i = 0; i < tableData.headers.length; i++) {
      const rect = figma.createRectangle();
      rect.strokes = [{ type: 'SOLID', color: borderColor }]
      rect.strokeAlign = 'CENTER';
      rect.resize(144, 36);
      rect.x = 180 + i * 164;
      rect.y = 0;
      rect.fills = [{ type: 'SOLID', color: backgroundColor }]
      const text = figma.createText();
      text.fontSize = 12;
      text.x = rect.x + 10;
      text.y = rect.y + 10;
      text.characters = tableData.headers[i];
      parentFrame.appendChild(rect);
      parentFrame.appendChild(text);

      // Score boxes
      for (let j = 0; j < 4; j++) {
        const rect = figma.createRectangle();
        rect.strokes = [{ type: 'SOLID', color: borderColor }]
        rect.strokeAlign = 'CENTER';
        rect.resize(36, 36);
        rect.x = 180 + count * 36;
        if (i === 1) {
            rect.x = rect.x + 20;
        } else if (i === 2) {
            rect.x = rect.x + 40;
        }
        rect.y = 36;
        rect.fills = [{ type: 'SOLID', color: backgroundColor }]
        const text = figma.createText();
        text.fontSize = 12;
        text.x = rect.x + 12;
        text.y = rect.y + 10;
        text.characters = String((j - 2))
        count++
        parentFrame.appendChild(rect);
        parentFrame.appendChild(text);
      }
    }
    for (let i = 0; i < tableData.rows.length; i++) {
      for (let j = -1; j < tableData.rows[i].scores.length; j++) {
        const rect = figma.createRectangle();
        rect.strokes = [{ type: 'SOLID', color: borderColor }]
        rect.strokeAlign = 'CENTER';
        const text = figma.createText();
        text.fontSize = 12
        rect.y = (i + 2) * 36;

        // Row titles
        if (j === -1) {
          rect.resize(160, 36);
          rect.x = 0;
          text.x = rect.x + 10;
          text.characters = tableData.rows[i].criteria;
          rect.fills = [{ type: 'SOLID', color: backgroundColor }]
        } else { // Score boxes
          rect.resize(36, 36);
          rect.x = 180 + j * 36;
          if (j > 3 && j < 8) {
            rect.x = rect.x + 20;
          } else if (j > 7) {
            rect.x = rect.x + 40;
          }rect.fills = [{
            type: 'SOLID',
            color: tableData.rows[i].scores[j].color === 'red' ? {
              r: 253 / 255,
              g: 33 / 255,
              b: 37 / 255
            } : tableData.rows[i].scores[j].color === 'green' ? {
              r: 36 / 255,
              g: 140 / 255,
              b: 41 / 255
            } : {
              r: 245 / 255,
              g: 245 / 255,
              b: 245 / 255
            }
          }];
        }
        text.y = rect.y + 10;
        parentFrame.appendChild(rect);
        parentFrame.appendChild(text);
      }
    }
  } catch (error) {
    console.error(error)
  }
  figma.closePlugin();
}
