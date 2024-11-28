import Konva from 'konva';
import { getContainer } from '../utils';
import type { KonvaOption } from '../types';

export class Layers {
  private currentLayerId: string = '';
  private layerMap: Map<string, Konva.Layer> = new Map();

  constructor(private option: KonvaOption) {}

  private createKonva() {
    const option = this.option;
    const root = getContainer(option.container);
  }

  /**
   * 创建图层
   * @returns
   */
  public createLayer() {
    const layer = new Konva.Layer();
    console.log(layer.id());
    this.layerMap.set(layer.id(), layer);
    return layer;
  }
}
