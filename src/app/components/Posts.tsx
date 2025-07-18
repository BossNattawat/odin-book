import React from 'react'
import Post from './Post'

function Posts({ posts, userInfo }) {
    
  return (
    <section className='flex flex-col gap-y-8'>
        {posts.length > 0 ? (
            <>
                {posts.map((post) => (
                    <Post displayname={userInfo.displayName} username={userInfo.username} content={post.content} comments={post.comments} likes={post.likes} />
                ))}
            </>
        ) : (
            <div>
                <h1 className='text-2xl'>No post yet</h1>
            </div>
        )}
    </section>
  )
}

export default Posts