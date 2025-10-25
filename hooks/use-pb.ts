import ky from 'ky';
import { Collection, QueryParams } from './use-pb.d';

export class UsePb {
    private collection: Collection;
    private queryParams: QueryParams;

    constructor(collection: Collection, queryParams: QueryParams) {
        this.collection = collection;
        this.queryParams = queryParams;
    }

    public async get() {
        return ky.get(`${process.env.API_URL}/collections/${this.collection}/records`, {
            searchParams: this.queryParams,
        }).json();
    }

    public async getOne(id: string) {
        return ky.get(`${process.env.API_URL}/collections/${this.collection}/records/${id}`).json();
    }

    public async delete(id: string) {
        return ky.delete(`${process.env.API_URL}/collections/${this.collection}/records/${id}`).json();
    }
}

export type UsePbInstance = InstanceType<typeof UsePb>;

/**
 * Creates an instance of UsePb for a specific collection with optional query parameters.
 *
 * @param {Collection} collection - The collection to query.
 * @param {QueryParams} [queryParams] - Optional query parameters.
 * @param {number} [queryParams.page] - The page number to return.
 * @param {number} [queryParams.perPage] - The number of items to return per page.
 * @param {string} [queryParams.sort] - The field to sort by.
 * @param {string} [queryParams.filter] - The filter to apply.
 * @param {string} [queryParams.expand] - The fields to expand.
 * @param {string} [queryParams.fields] - The fields to return.
 * @param {boolean} [queryParams.skipTotal] - Whether to skip the total count.
 * 
 * @example
 * const usePosts = useClient('posts', { page: 1, perPage: 10 });
 * const posts = await usePosts.get();
 * @returns {UsePbInstance} An instance of UsePb for the specified collection and query parameters.
 */

export function UseClient(collection: Collection, queryParams?: QueryParams): UsePbInstance {
    return new UsePb(collection, queryParams!);
}
