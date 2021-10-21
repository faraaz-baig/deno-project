
import { Client } from "https://deno.land/x/postgres/mod.ts";
import {dbCreds} from "../db.config.ts"

//Init Client 
const client = new Client(dbCreds)


// @desc Get all posts
// @route GET /api/v1/posts
const getPosts = async({response}: {response: any}) => {
    try {
        await client.connect()

        const result = await client.queryArray("SELECT * FROM posts")
        if (result.rows.length === 0 ) {
            response.body = {
                success: true,
                message: "There is no data in the database 😒"
            }
        } else {
            const posts = new Array()

            result.rows.map(p => {
                const obj: any = new Object()
    
                result.rowDescription?.columns.map((el, i) => {
                    obj[el.name] = p[i]
    
                })
    
                posts.push(obj)
                response.body = {
                    success: true,
                    data: posts
                }
            })
        }
    }  catch(err) {
        response.body = {
            success: false,
            message: err.message
        }

    }
       
}

// @desc Get single post
// @route GET /api/v1/posts/:id
const getPost = async({params, response}: {params: {id: string}, response: any}) => {
    try {
        await client.connect()

        const result = await client.queryArray("SELECT * FROM posts WHERE id = $1", params.id)

        if(result.rows.toString() == "") {
            response.status = 404
            response.body = {
                success: false, 
                message: `No post with thwe id of ${params.id}`
            }
            return;
        } else {
            const post: any = new Object()

            result.rows.map(p => {
                result.rowDescription?.columns.map((el, i) => {
                    post[el.name] = p[i]
                })
            })

            response.body = {
                success: true,
                data: post
            }
        }
    } catch(err) {
        response.body = {
            success: false,
            message: err.message
        }
    } finally {
        await client.end()
    }
}

// @desc Add post
// @route POST /api/v1/posts
const addPosts = async({request, response}: {request: any, response: any}) => {
    const body = await request.body({type: "json"})
    const post = await body.value

    if(!request.hasBody){
        response.status = 400
        response.body = {
            success: false,
            message: "Please send some data"
        }
    } else {
        try {
            await client.connect();

            const result = await client.queryArray("INSERT INTO posts(title,body) VALUES($1,$2)", post.title, post.body)
            response.status = 201
            response.body = {
                success: true,
                data: result
            }
        } catch (err) {
            response.status = 500
            response.body = {
                success: false,
                message: err.toString()

            }
        } finally {
            await client.end()
        }
    }
}


// @desc Edit all posts
// @route PUT /api/v1/posts/:id
const editPosts = async ({params, request, response}: {params: {id: string}, request: any, response: any}) => {
    await getPost({params: {"id": params.id}, response })

    if(response.status === 404) {
        response.body = {
            success: false,
            message: response.body.message
        }
        response.status = 404
        return;
    } else {
        const body = await request.body()
        const post = await body.value

        if(!request.hasBody){
            response.status = 400
            response.body = {
                success: false,
                message: "Please send some data"
            }
        } else {
            try {
                await client.connect();
    
                const result = await client.queryArray("UPDATE posts SET title=$1, body=$2 WHERE id=$3", post.title, post.body, params.id)
                response.status = 200
                response.body = {
                    success: true,
                    data: post
                }
            } catch (err) {
                response.status = 500
                response.body = {
                    success: false,
                    message: err.toString()
    
                }
            } finally {
                await client.end()
            }
        }
    }
}

// @desc Delete all posts
// @route DELETE /api/v1/posts/:id
const deletePosts = async ({params, response}: {params: {id: string}, response: any}) => {
    await getPost( {params: {"id": params.id}, response})

    if(response.status === 404) {
        response.body = {
            success: false,
            message: "Cannot delete the post 😑"
        }
        response.status = 404
        return
    } else {
        try {
            await client.connect()

            const result = await client.queryArray("DELETE FROM posts WHERE id=$1", params.id)

            response.body = {
                success : true,
                data: "🚫 post deleted successfully"
            }
            response.status = 204
        } catch (err) {
            response.status = 500
            response.body = {
                success: false,
                message: err.toString()
            }
        } finally {
            await client.end()
        }
        
    }
    
}

export {getPosts, addPosts, getPost, editPosts, deletePosts}