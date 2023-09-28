/**
* This file was @generated using pocketbase-typegen
*/

export enum Collections {
	Posts = "posts",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type PostsRecord<Tcontent = unknown> = {
	content?: null | Tcontent
	uid: string
}

export type UsersRecord = {
	avatar?: string
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type PostsResponse<Tcontent = unknown, Texpand = unknown> = Required<PostsRecord<Tcontent>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	posts: PostsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	posts: PostsResponse
	users: UsersResponse
}