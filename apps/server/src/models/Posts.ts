import mongoose, { Schema, model, Document } from 'mongoose'
import type { ConnectionSyncIndexesResult, Model, ObjectId, Types } from 'mongoose'
import { z, infer as ZInfer } from 'zod'
export const PostVisibility = {
    PRIVATE: "PRIVATE",
    UNLISTED: "UNLISTED",
    PUBLIC: "PUBLIC"
} as const

type PostVisibility = typeof PostVisibility[keyof typeof PostVisibility];

interface Post extends Document, ZInfer<typeof PostValidatorBase> {
    author: {
        _id: Types.ObjectId,
        username: string
    }

}

interface PostMethods { }
interface PostStatics { }
interface PostModel extends Model<Post, {}, PostMethods, {}, {}, PostStatics>, PostStatics { }

export const PostValidatorBase = z.object({
    title: z.string().max(100, "A post title cannot be longer than 100 characters"),
    visibility: z.nativeEnum(PostVisibility, {
        invalid_type_error: "Invalid visibility level."
    }),
    content: z.string().min(128, "Too little content").max(32768, "Too much content"),
})

// const PostSchema = new Schema<Post, {}, PostMethods, {}, {}, PostStatics>({
// const PostSchema = new Schema<Post, PostModel, PostMethods>({
const PostSchema = new Schema<Post>({
    title: {
        type: "string",
        required: true,
        validate: {
            validator: async function (e: unknown) {
                const result = (await PostValidatorBase.shape.title.safeParseAsync(e))
                return result.success
            },
            message: "\"{VALUE}\" is not a valid title."
        }
    },
    visibility: {
        type: "string",
        enum: Object.values(PostVisibility),
        required: true,
        default: "PRIVATE",
        validate: {
            validator: async function (e: unknown) {
                const result = (await PostValidatorBase.shape.visibility.safeParseAsync(e))
                return result.success
            },
            message: "\"{VALUE}\" is not a valid vizibility level."
        }
    },
    content: {
        type: "string",
        required: true,
        validate: {
            validator: async function (e: unknown) {
                const result = (await PostValidatorBase.shape.visibility.safeParseAsync(e))
                return result.success
            },
            message: `Content is not a valid length. Content should be between ${PostValidatorBase.shape.content.minLength} and ${PostValidatorBase.shape.content.maxLength} characters.`
        }
    },
    author: {
        _id: {
            type: "ObjectID",
            required: true,
        },
        username: {
            type: "string",
            required: true
        }
    }

}, {

    timestamps: true,
})
PostSchema.set("autoIndex", true)




const Posts = model('posts', PostSchema)
export default Posts

