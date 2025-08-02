
import CommentComponent from './Comment'

interface Author {
  username: string;
  displayName: string;
  profilePic: string;
}

interface Post {
  id: string;
  author: Author;
  authorId: string;
  content: string;
  commentCount: number;
  likeCount: number;
  createdAt: string;
}

interface Comment {
  id: string;
  author: Author;
  authorId: string;
  content: string;
  createdAt: string;
  post: Post
}

interface CommentProps {
  comment: Comment[];
}

function Comments({ comment } : CommentProps) {
    
  return (
    <section className='flex flex-col gap-y-8'>
        {comment ? (
            <div>
                {comment.map((comment) => (
                    <CommentComponent key={comment.id} comment={comment} />
                ))}
            </div>
        ) : (
            <div className='p-8 flex justify-center items-center'>
                <h1 className='text-2xl'>No comment yet</h1>
            </div>
        )}
    </section>
  )
}

export default Comments