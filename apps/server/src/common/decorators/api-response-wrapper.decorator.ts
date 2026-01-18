import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse as SwaggerApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponse } from '../dto/response.dto.js';

/**
 * API响应包装装饰器配置选项
 */
export interface ApiResponseWrapperOptions {
  /** HTTP状态码，默认200 */
  status?: number;
  /** 响应描述 */
  description?: string;
  /** 数据是否为数组类型 */
  isArray?: boolean;
}

/**
 * API响应包装装饰器
 * 自动将响应类型包装为 ApiResponse<T> 格式，使 Swagger 文档正确显示拦截器处理后的响应结构
 *
 * @param model - 数据模型类型（data字段的类型）
 * @param options - 配置选项
 *
 * @example
 * // 单个对象响应
 * @ApiResponseWrapper(UserDto, { description: '获取用户成功' })
 * async getUser() { ... }
 *
 * @example
 * // 数组响应
 * @ApiResponseWrapper(UserDto, { description: '获取用户列表', isArray: true })
 * async getUsers() { ... }
 *
 * @example
 * // 无数据响应（仅返回状态）
 * @ApiResponseWrapper(null, { description: '操作成功' })
 * async deleteUser() { ... }
 */
export const ApiResponseWrapper = <TModel extends Type<any>>(
  model: TModel | null,
  options?: ApiResponseWrapperOptions
) => {
  const { status = 200, description = '成功', isArray = false } = options || {};

  // 如果没有指定模型，返回基础的 ApiResponse 结构
  if (!model) {
    return applyDecorators(
      ApiExtraModels(ApiResponse),
      SwaggerApiResponse({
        status,
        description,
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiResponse) },
            {
              properties: {
                data: {
                  type: 'object',
                  nullable: true,
                },
              },
            },
          ],
        },
      })
    );
  }

  // 有模型时，构建完整的响应结构
  return applyDecorators(
    ApiExtraModels(ApiResponse, model),
    SwaggerApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  }
                : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    })
  );
};

/**
 * API错误响应装饰器
 * 用于标注可能的错误响应
 *
 * @param status - HTTP错误状态码
 * @param description - 错误描述
 *
 * @example
 * @ApiErrorResponse(401, '未授权')
 * @ApiErrorResponse(404, '用户不存在')
 * async getUser() { ... }
 */
export const ApiErrorResponse = (status: number, description: string) => {
  return applyDecorators(
    ApiExtraModels(ApiResponse),
    SwaggerApiResponse({
      status,
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              code: { type: 'number', example: status },
              message: { type: 'string', example: description },
              data: { type: 'null' },
            },
          },
        ],
      },
    })
  );
};
