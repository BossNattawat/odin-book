
import Image from "next/image";
import Link from "next/link";

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
  comment: Comment;
}

function Comment({ comment }: CommentProps) {

  return (
    <div className="flex flex-col gap-y-3 border-b-[1px] border-slate-600 py-3 px-8">
      <div className="flex gap-3 items-center">
        <Image
          src={comment.author.profilePic || "/avatar.png"}
          alt="profile"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col gap-x-1">
          <Link href={`/profile/${comment.author.username}`} className="font-semibold">{comment.author.displayName}</Link>
          <p className="text-gray-400">@{comment.author.username}</p>
        </div>
      </div>
      <p className="text-lg">{comment.content}</p>
    </div>
  );
}

export default Comment;
