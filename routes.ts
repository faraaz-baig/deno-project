import { Router } from "https://deno.land/x/oak/mod.ts";
import {getPosts, getPost, editPosts, deletePosts, addPosts} from "./controllers/posts.ts"

const router = new Router()

router
    .get('/api/v1/posts', getPosts)
    .post('/api/v1/posts', addPosts)
    .get('/api/v1/posts/:id', getPost)
    .put('/api/v1/posts/:id', editPosts)
    .delete('/api/v1/posts/:id', deletePosts)
export default router