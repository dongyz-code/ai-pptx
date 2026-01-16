import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 标准API响应包装类
 */
export class ApiResponse<T = any> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '消息', example: 'success' })
  message: string;

  @ApiPropertyOptional({ description: '数据', type: Object })
  data?: T;

  @ApiProperty({ description: '时间戳' })
  timestamp: number;

  constructor(code: number, message: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
    this.timestamp = Date.now();
  }

  static success<T>(data?: T, message = 'success'): ApiResponse<T> {
    return new ApiResponse(200, message, data);
  }

  static error(code: number, message: string): ApiResponse<null> {
    return new ApiResponse(code, message, null);
  }
}

/**
 * 分页查询参数
 */
export class PaginationDto {
  @ApiPropertyOptional({ description: '页码', default: 1, minimum: 1 })
  page?: number = 1;

  @ApiPropertyOptional({ description: '每页条数', default: 10, minimum: 1, maximum: 100 })
  pageSize?: number = 10;
}

/**
 * 分页响应
 */
export class PaginatedResponse<T> {
  @ApiProperty({ description: '数据列表', type: 'array', items: { type: 'object' } })
  list: T[];

  @ApiProperty({ description: '总条数' })
  total: number;

  @ApiProperty({ description: '当前页码' })
  page: number;

  @ApiProperty({ description: '每页条数' })
  pageSize: number;

  @ApiProperty({ description: '总页数' })
  totalPages: number;

  constructor(list: T[], total: number, page: number, pageSize: number) {
    this.list = list;
    this.total = total;
    this.page = page;
    this.pageSize = pageSize;
    this.totalPages = Math.ceil(total / pageSize);
  }
}
