import * as pocketbaseTypes from '../types/pocketbase-types';

export declare type Collection = keyof pocketbaseTypes.CollectionRecords;

export declare type QueryParams = {
    page?: number;
    perPage?: number;
    sort?: string;
    filter?: string;
    expand?: string;
    fields?: string;
    skipTotal?: boolean;
};