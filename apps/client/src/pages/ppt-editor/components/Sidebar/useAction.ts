import { uuid } from '@/utils';
import { useSlides, useEditor } from '../../models';
import type {
  PPTTextElement,
  PPTShapeElement,
  PPTLineElement,
  PPTImageElement,
  PPTTableElement,
  PPTChartElement,
  TableCell,
} from '@/types';

export const useAction = () => {
  const { addElement } = useSlides();
  const { editorState } = useEditor();

  /** 获取画布中心位置 */
  const getCanvasCenter = (elementWidth: number, elementHeight: number) => {
    const { viewportSize, viewportRatio } = editorState;
    const canvasWidth = viewportSize;
    const canvasHeight = viewportSize / viewportRatio;
    return {
      left: canvasWidth / 2 - elementWidth / 2,
      top: canvasHeight / 2 - elementHeight / 2,
    };
  };

  const onAddText = (textElement: Partial<PPTTextElement> = {}) => {
    const width = 200;
    const height = 30;
    const { left, top } = getCanvasCenter(width, height);

    const defaultTextElement: PPTTextElement = {
      id: uuid(),
      type: 'text',
      top,
      left,
      width,
      height,
      content: '你的段落文字',
      rotate: 0,
      defaultFontName: 'Microsoft Yahei',
      defaultColor: '#333',
    };

    addElement(Object.assign(defaultTextElement, textElement));
  };

  const onAddShape = (shapeElement: Partial<PPTShapeElement> = {}) => {
    const width = 200;
    const height = 200;
    const { left, top } = getCanvasCenter(width, height);

    const defaultShapeElement: PPTShapeElement = {
      id: uuid(),
      type: 'shape',
      top,
      left,
      width,
      height,
      viewBox: [200, 200],
      path: 'M 0 0 L 200 0 L 200 200 L 0 200 Z',
      fill: '#4A90E2',
      fixedRatio: false,
      rotate: 0,
    };

    addElement(Object.assign(defaultShapeElement, shapeElement));
  };

  const onAddLine = (lineElement: Partial<PPTLineElement> = {}) => {
    const width = 200;
    const height = 0;
    const { left, top } = getCanvasCenter(width, height);

    const defaultLineElement: PPTLineElement = {
      id: uuid(),
      type: 'line',
      top,
      left,
      width,
      start: [0, 0],
      end: [200, 0],
      style: 'solid',
      color: '#4A90E2',
      points: ['', ''],
    };

    addElement(Object.assign(defaultLineElement, lineElement));
  };

  const onAddImage = (imageElement: Partial<PPTImageElement> = {}) => {
    const width = 300;
    const height = 200;
    const { left, top } = getCanvasCenter(width, height);

    const defaultImageElement: PPTImageElement = {
      id: uuid(),
      type: 'image',
      top,
      left,
      width,
      height,
      src: '',
      fixedRatio: true,
      rotate: 0,
    };

    addElement(Object.assign(defaultImageElement, imageElement));
  };

  const onAddTable = (options: { rows: number; cols: number }) => {
    const { rows, cols } = options;

    const cellWidth = 100;
    const cellHeight = 40;
    const width = cellWidth * cols;
    const height = cellHeight * rows;
    const { left, top } = getCanvasCenter(width, height);

    // 生成表格数据
    const data: TableCell[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: TableCell[] = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          id: uuid(),
          colspan: 1,
          rowspan: 1,
          text: '',
        });
      }
      data.push(row);
    }

    // 计算列宽百分比
    const colWidths = Array(cols).fill(100 / cols);

    const defaultTableElement: PPTTableElement = {
      id: uuid(),
      type: 'table',
      top: top,
      left: left,
      width: width,
      height: height,
      rotate: 0,
      colWidths: colWidths,
      cellMinHeight: cellHeight,
      data: data,
      outline: {
        width: 2,
        color: '#4A90E2',
        style: 'solid',
      },
    };

    addElement(defaultTableElement);
  };

  const onAddChart = (options: { chartType: string }) => {
    const { chartType } = options;

    const width = 400;
    const height = 300;
    const { left, top } = getCanvasCenter(width, height);

    const defaultChartElement: PPTChartElement = {
      id: uuid(),
      type: 'chart',
      top,
      left,
      width,
      height,
      rotate: 0,
      chartType: chartType as any,
      data: {
        labels: ['类别1', '类别2', '类别3', '类别4'],
        legends: ['系列1'],
        series: [[10, 20, 30, 40]],
      },
      themeColors: ['#4A90E2', '#50C878', '#FFB74D', '#E57373'],
    };

    addElement(defaultChartElement);
  };

  return {
    onAddText,
    onAddShape,
    onAddLine,
    onAddImage,
    onAddTable,
    onAddChart,
  };
};
