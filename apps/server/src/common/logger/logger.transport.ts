import pino from 'pino';

/**
 * Elasticsearch 日志传输接口
 * 用于将日志发送到 Elasticsearch
 */
export interface ElasticsearchTransportOptions {
  node: string; // ES 节点地址
  index: string; // 索引名称
  auth?: {
    username: string;
    password: string;
  };
}

/**
 * Elasticsearch Transport
 * 预留接口，用于将日志写入 ES
 */
export class ElasticsearchTransport {
  private options: ElasticsearchTransportOptions;

  constructor(options: ElasticsearchTransportOptions) {
    this.options = options;
  }

  /**
   * 创建 Pino 传输流
   * 当前返回 null，需要时可以实现实际的 ES 写入逻辑
   */
  createStream(): pino.DestinationStream | null {
    // TODO: 实现 ES 写入逻辑
    // 可以使用 @elastic/elasticsearch 客户端
    // 示例实现：
    // const { Client } = require('@elastic/elasticsearch');
    // const client = new Client({
    //   node: this.options.node,
    //   auth: this.options.auth
    // });
    //
    // return pino.destination({
    //   write: (chunk) => {
    //     const log = JSON.parse(chunk);
    //     client.index({
    //       index: this.options.index,
    //       body: log
    //     });
    //   }
    // });

    return null;
  }

  /**
   * 批量写入日志到 ES
   */
  async bulkWrite(logs: any[]): Promise<void> {
    // TODO: 实现批量写入逻辑
    console.log(`[ES Transport] Would write ${logs.length} logs to ${this.options.node}`);
  }
}
