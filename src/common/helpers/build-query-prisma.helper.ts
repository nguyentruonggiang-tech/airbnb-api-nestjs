import type { Request } from 'express';

export type BuildQueryPrismaOptions = {
    /** Bật khi model có cột isDeleted (soft delete) */
    withSoftDelete?: boolean;
    pageDefault?: number;
    pageSizeDefault?: number;
    /** Các field tìm kiếm khi có keyword (contains) */
    keywordFields?: string[];
    /** Ưu tiên keyword truyền từ ngoài (vd: path param) */
    keyword?: string;
};

export type BuildQueryPrismaResult = {
    page: number;
    pageSize: number;
    index: number;
    where: Record<string, unknown>;
};

export const buildQueryPrisma = (
    req: Request,
    options: BuildQueryPrismaOptions = {},
): BuildQueryPrismaResult => {
    const {
        withSoftDelete = false,
        pageDefault = 1,
        pageSizeDefault = 10,
        keywordFields = [],
        keyword: keywordOption,
    } = options;

    const { page, pageSize, keyword } = req.query;

    let pageNumber = Number(page);
    let pageSizeNumber = Number(pageSize);

    pageNumber = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : pageDefault;
    pageSizeNumber =
        Number.isFinite(pageSizeNumber) && pageSizeNumber > 0
            ? pageSizeNumber
            : pageSizeDefault;

    const index = (pageNumber - 1) * pageSizeNumber;

    const where: Record<string, unknown> = {
        ...(withSoftDelete ? { isDeleted: false } : {}),
    };

    let q = '';
    if (typeof keywordOption === 'string') {
        q = keywordOption.trim();
    } else if (typeof keyword === 'string') {
        q = keyword.trim();
    }

    if (q && keywordFields.length > 0) {
        where.OR = keywordFields.map((field) => ({
            [field]: { contains: q },
        }));
    }

    return {
        page: pageNumber,
        pageSize: pageSizeNumber,
        index,
        where,
    };
};
