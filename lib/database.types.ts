import type { JSONContent } from '@tiptap/react';


export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            posts: {
                Row: {
                    content: JSONContent | string
                    created_at: string
                    description: string
                    id: number
                    image: string
                    public: boolean | null
                    title: string
                    slug: string
                }
                Insert: {
                    content: JSONContent | string
                    created_at?: string
                    description?: string
                    id?: number
                    image?: string
                    public?: boolean | null
                    title?: string
                    slug: string
                }
                Update: {
                    content: JSONContent | string
                    created_at?: string
                    description?: string
                    id?: number
                    image?: string
                    public?: boolean | null
                    title?: string
                    slug?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
