import mongoose, { Schema, model, Document } from 'mongoose'
import type { Model, Types, } from 'mongoose'
import bcrypt from 'bcrypt'
import argon, { argon2id } from 'argon2'
import Posts, { PostValidatorBase, PostVisibility } from './Posts'
import zod,{ z, infer as ZInfer,ZodError} from 'zod'

interface User extends Document {
    username: string,
    email: string,
    confirmedEmail: boolean,
    password: string
}
interface UserMethods {
    updatePassword: (newPassword: string) => Promise<boolean>,
    login: (password: string) => Promise<boolean>,
    createPost: (postData: unknown) => Promise<boolean| ReadonlyArray<zod.ZodIssue>>
}
interface UserStatics {
    loginUser: (username: string, password: string) => Promise<boolean>
}
interface UserModel extends Model<User, {}, UserMethods>, UserStatics { }
const UserSchema = new Schema<User, {}, UserMethods, {}, {}, UserStatics>({
    // const UserSchema = new Schema<User, UserModel, UserMethods>({
    username: {
        type: "string",
        required: true,
        unique: true,
        index: true
    },

    email: {
        type: "string",
        required: true,
        unique: true,
        index: true
    },
    confirmedEmail: {
        type: "boolean",
        required: true,
        default: false,

    },
    password: {
        type: "string",
        required: true,
    }
}, {
    methods: {
        async updatePassword (newPassword) {
            const result = (await this.updateOne({ password: await getNewHash(newPassword) }).then((e) => true).catch(e => false))
            return result
        },
        async login (password) {

            return await checkHash(password, this.password)
        },
        async createPost (postData) {
            const parseResult =  await PostValidatorBase.safeParseAsync(postData)
            parseResult
            if (!parseResult.success)
                return parseResult.error.errors //parseResults.error.errors
            // ^?
            const result = await Posts.create({
                ...parseResult.data,
                author: {
                    _id: this.id,
                    username: this.username
                },

            }).then(e=>true).catch(e=>false);
            
            return result
        }
    },
    statics: {
        async loginUser (username: string, password: string) {
            const user = await this.findOne({ username }) as null | InstanceType<Model<User, {}, UserMethods>>
            if (user === null)
                return false
            return await user.login(password)

        }
    }
})
UserSchema.set("autoIndex", true)


UserSchema.pre("save", async function (next) {
    if (this.isModified("password"))
        this.password = await getNewHash(this.password)
    next()

})


const Users = model('users', UserSchema)
export default Users

async function getNewHash (password: string) {
    const hash = await argon.hash(password, {
        type: argon2id,
        memoryCost: 2 ** 16,
        hashLength: 32,
        parallelism: 4,
    })
    return hash
}
async function checkHash (password: string, hash: string) {
    return await argon.verify(hash, password)
}
Users.loginUser