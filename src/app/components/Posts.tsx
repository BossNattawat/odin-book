import React from 'react'
import PostComponent from './Post'

interface Author {
  username: string
  displayName: string
}

interface Post {
  id: string
  author: Author
  authorId: string
  content: string
  commentCount: number
  likeCount: number
  createdAt: string
}

interface Posts {
    posts: Post[]
}

function Posts({ posts } : Posts) {

    console.log(posts);
    
  return (
    <section className='flex flex-col gap-y-8'>
        {posts ? (
            <div>
                {posts.map((post, index) => (
                    <PostComponent key={index} post={post} />
                ))}
            </div>
        ) : (
            <div className='p-8 flex justify-center items-center'>
                <h1 className='text-2xl'>No post yet</h1>
            </div>
        )}
    </section>
  )
}

export default Posts