import { useEffect, useState } from 'react'
import PostComponent from './Post'
import axios from 'axios'
import { useSession } from 'next-auth/react'

interface Author {
  username: string
  displayName: string
  profilePic: string;
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

  const { data: session } = useSession();
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchLikedPosts() {
      if (!session?.user.username) return;

      try {
        // Pass username as query param
        const res = await axios.get("/api/posts/like", {
          params: { username: session.user.username },
        });
        const likedPosts = res.data.likedPosts || [];
        const ids = new Set<string>(likedPosts.map((p: Post) => p.id));
        setLikedPostIds(ids);
      } catch (err) {
        console.error("Failed to fetch liked posts", err);
      }
    }

    fetchLikedPosts();
  }, [session]);
    
  return (
    <section className='flex flex-col gap-y-8'>
        {posts ? (
            <div>
                {posts.map((post) => (
                    <PostComponent key={post.id} post={post} initiallyLiked={likedPostIds.has(post.id)} />
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